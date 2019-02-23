export const test = require('tape') as any

const Reset = "\x1b[0m"
const Bright = "\x1b[1m"
const Dim = "\x1b[2m"
const Underscore = "\x1b[4m"
const Blink = "\x1b[5m"
const Reverse = "\x1b[7m"
const Hidden = "\x1b[8m"

const FgBlack = "\x1b[30m"
const FgRed = "\x1b[31m"
const FgGreen = "\x1b[32m"
const FgYellow = "\x1b[33m"
const FgBlue = "\x1b[34m"
const FgMagenta = "\x1b[35m"
const FgCyan = "\x1b[36m"
const FgWhite = "\x1b[37m"

const BgBlack = "\x1b[40m"
const BgRed = "\x1b[41m"
const BgGreen = "\x1b[42m"
const BgYellow = "\x1b[43m"
const BgBlue = "\x1b[44m"
const BgMagenta = "\x1b[45m"
const BgCyan = "\x1b[46m"
const BgWhite = "\x1b[47m"

const BACK_START = FgYellow;
const BACK = `${BACK_START}%s${BACK_START}`;
const CLEAR = Reset


let fall = 0
let pass = 0
test.createStream({objectMode: true}).on('data', (row) => {
    let str = JSON.stringify(row)
    // console.log(row.name)
    switch (row.type) {
        case  "test":
            console.log("\n")
            console.log(BACK, BgBlue + "  " + Reset + FgBlue + " 🌀 " + FgMagenta + row.name + "")
            // console.log("\n")
            break
        default :
            if (row.ok) {
                console.log(FgGreen + " ✓ " + BgGreen + `  ${CLEAR} ${Bright + row.name} ${Reset + FgGreen} . ${Reset}`)
                pass++
            }
            else if (row.ok === false) {
                fall++
                console.log(BgRed + `  ${CLEAR} ${Bright + row.name} ${Reset + FgRed}x${FgYellow} ` + row.file)
            }
            else {
                if (fall == 0) console.log(FgGreen + "\nv  " + pass + " test successful done")
                if (fall > 0) console.log(FgRed + "\nx  " + fall + " tests fall")
            }
    }
});
