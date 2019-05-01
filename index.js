// Thanks Leiki uwu

const config = require('./config.json')

module.exports = function SkillResets(mod) {

    const skillResetType = 6
    const succesiveSkillResets = new Map()
    const skillResetsLog = new Map()

    let model
	
	mod.hook('S_LOGIN', mod.majorPatchVersion >= 81 ? 13 : 12, event => { model = event.templateId })		 

    mod.hook('S_CREST_MESSAGE', 2, ({ type, skill }) => {
        if (skillResetType !== type) return

        // Count and store resets
        let tempCounter = 1
        const skillBase = Math.round(skill / 1000)
        if (succesiveSkillResets.has(skillBase)) {
            tempCounter = succesiveSkillResets.get(skillBase)
            ++tempCounter
        }
        succesiveSkillResets.set(skillBase, tempCounter)

		let resetCount = (config.renew_popup && tempCounter > 1) ? tempCounter : ''
        mod.send('S_DUNGEON_EVENT_MESSAGE', 2, {
            message: `<img src="img://skill__0__${model}__${skill}" width="${config.image_size}" height="${config.image_size}" vspace="-20"/><font size="${config.font_size}" color="${config.reset_font_color}">&nbsp;Reset ${resetCount}</font>`,
            type: 70
        })
        return false
    })

    mod.hook('S_START_COOLTIME_SKILL', 3, event => {
        const skillBase = Math.round(event.skill.id / 1000)
        if (succesiveSkillResets.has(skillBase)) {
            succesiveSkillResets.set(skillBase, 0)
        }
    })
}
