// Thanks Leiki uwu

const config = require('./config.json'),
	blacklist = [130900, 130901, 130902],
	haymaker = [60941, 60942, 60946, 60947, 60951, 60952, 60956, 60957, 60961, 60962, 60966, 60967]

module.exports = function SkillResets(mod) {

    const succesiveSkillResets = new Map()
    const skillResetsLog = new Map()

    let model

	mod.hook('S_LOGIN', 14, event => { model = event.templateId })		 

    mod.hook('S_CREST_MESSAGE', 2, ({ type, skill }) => {
        if (type !== 6 || skill === undefined || blacklist.includes(skill)) return
		
		if(haymaker.includes(skill)) skill = 60901

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
