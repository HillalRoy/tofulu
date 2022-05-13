import { AppState } from "./data"

export class Circit {
    lines: InputLine[] = []
    readonly lineOffsetY = 50
    gates: Gate[] = []

    constructor(private linesNo: number) {
        for (let i = 0; i < this.linesNo; i++) {
            this.lines.push(new InputLine(this.lineOffsetY + i * this.lineOffsetY, i))
        }
    }

    height: number = 0
    width: number = 0
    setDimention(width: number, height: number) {
        this.height = height
        this.width = width
        this.lineLength = this.width - 80

    }

    eval(input: string): string[] {
        const res: string[] = [input]
        let cInput = input
        for (const g of this.gates) {
            cInput = g.eval(cInput)
            res.push(cInput)
        }
        return res
    }
    lineLength: number = 0

    gateAdder = new GateAdder()


    onClick(x: number, y: number) {
        // this.gateAdder.onClick(x, y)
        const gateSpaceSize = this.lineLength / (this.gates.length + 1)
        if (!this.gateAdder.gateOnFocus && this.gateAdder.target !== undefined) {
            const i = Math.floor(x / gateSpaceSize)
            this.gates.splice(i, 0, new Gate(this.lines, this.gateAdder.target.lineNo, (g) => this.gates = this.gates.filter(gs => gs !== g)))
        } else {
            this.gates.forEach((g, i) => g.onClick(x, y, (i + 1) * gateSpaceSize,this.height) )
        }

        this.setInputs(this.inputStr)

    }

    updateMousePos(x: number, y: number) {
        const gateSpaceSize = this.lineLength / (this.gates.length + 1)
        this.gateAdder.offsetX = x
        const activeLine = this.lines.reduce((pl, line) => line.updateMousePos(x, y) ? line.lineNo : pl, -1)
        if (activeLine >= 0) {
            this.gateAdder.target = new Target(this.lines[activeLine].offsetY, activeLine)
        } else {
            this.gateAdder.target = undefined
        }

        this.gateAdder.gateOnFocus = this.gates.reduce<boolean>((pg, g, i) => g.updateMousePos(x, y, (i + 1) * gateSpaceSize, activeLine) || pg, false)
    }
    inputStr: string = '0010'
    outputStr: string = '0010'
    setInputs(inputStr: string){
        const res = this.eval(inputStr)
        this.inputStr = res[0]
        this.outputStr = res[res.length-1]
    }
    
    draw(ctx: CanvasRenderingContext2D) {
        const gateSpaceSize = this.lineLength / (this.gates.length + 1)
        for(let i = 0; i < this.lines.length; i++){
            ctx.font = "30px Arial"
            ctx.fillText(this.inputStr[i], 20, this.lines[i].offsetY + 10, 20)
            ctx.fillText(this.outputStr[i], this.width - 50, this.lines[i].offsetY + 4, 20)

        }

        this.lines.forEach(line => line.draw(ctx, this.lineLength))
        this.gates.forEach((g, i) => g.draw(ctx, (i + 1) * gateSpaceSize))

        this.gateAdder.draw(ctx)
    }
}

export class GateAdder {
    offsetX: number = 0
    width = 100
    gateOnFocus = false

    target?: Target = undefined

    // onClick(x: number, y: number) {
    //     if(!this.gateOnFocus){
    //     }
    // }
    draw(ctx: CanvasRenderingContext2D) {
        if (this.gateOnFocus) {
            return
        }
        ctx.save()
        ctx.translate(this.offsetX, 0)
        ctx.strokeStyle = `#3333`
        ctx.strokeRect(-this.width / 2, 10, this.width, ctx.canvas.height - 20)
        this.target?.draw(ctx)

        ctx.restore()
    }
}


export class Gate {
    controls: Control[] = []
    target: Target
    constructor(private lines: InputLine[], targetLine: number, private onDelete: (g: Gate) => void) {

        this.target = new Target(this.lines[targetLine].offsetY, targetLine)

        console.log(`[test] dummy control`);
        

        // let clineNo = randomInt(this.lines.length - 1)
        // while(clineNo === targetLine){
        //     clineNo = randomInt(this.lines.length - 1)
        // }

        // this.controls.push(new Control(this.lines[clineNo].offsetY, clineNo))
    }

    dummyControl?: Control

    onClick(x: number, y: number, offsetX: number, height:number) {
        if(this.isHover){
            if((x > (offsetX - (this.width / 2))) &&
            (x < offsetX + this.width / 2) &&
            (y > height - 20 - 20) &&
            (y < height - 10)) {
                this.onDelete(this)
            }
        }
        if(this.dummyControl){

            this.controls.push(this.dummyControl)
        }
    }
    eval(input: string): string {
        // and all control lines
        const c = this.controls.every(control => input[control.lineNo] === '1')
        // target line to chnage
        const t = input[this.target.lineNo] === '1'
        const newBit = (c !== t) ? '1' : '0'
        return input.substring(0, this.target.lineNo) + newBit + input.substring(this.target.lineNo + 1)
    }

    private isHover = false

    updateMousePos(x: number, y: number, offsetX: number, activeLine: number): boolean {
        this.isHover = (x > (offsetX - (this.width / 2))) && (x < offsetX + this.width / 2)

        if(this.isHover && activeLine >= 0 && activeLine !== this.target.lineNo && this.controls.every(c => c.lineNo !== activeLine)){
            this.dummyControl = new Control(this.lines[activeLine].offsetY, activeLine)
        } else{
            this.dummyControl = undefined
        }


        return this.isHover
    }

    width: number = 100

    draw(ctx: CanvasRenderingContext2D, offsetX: number) {
        ctx.save()
        ctx.translate(offsetX, 0)

        this.target.draw(ctx)
        this.controls.forEach(element => {
            ctx.beginPath()
            

            ctx.moveTo(0, this.target.offsetY)
            ctx.lineTo(0, element.offsetY)
            ctx.strokeStyle = '#dda'
            ctx.stroke()
            element.draw(ctx)
        })
        this.dummyControl?.draw(ctx)
        if (this.isHover){
            ctx.strokeRect(-this.width / 2, 10, this.width, ctx.canvas.height - 20)
            ctx.fillRect(-this.width / 2, ctx.canvas.height - 20 - 20, this.width, 30)
        }


        // this.elements.forEach(element => element.draw(ctx))
        ctx.restore()
    }
}

export class TofuluElement {

    draw(_ctx: CanvasRenderingContext2D) { }

}
export class Target extends TofuluElement {
    constructor(public readonly offsetY: number, public readonly lineNo: number) {
        super()
    }


    draw(ctx: CanvasRenderingContext2D) {
        ctx.save()

        super.draw(ctx)
        ctx.strokeStyle = '#dda'
        ctx.translate(0, this.offsetY)
        ctx.beginPath();
        ctx.arc(0, 0, 13, 0, 2 * Math.PI);
        ctx.moveTo(0, -13);
        ctx.lineTo(0, 13);
        ctx.moveTo(-13, 0);
        ctx.lineTo(13, 0);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore()
    }

}

export class Control extends TofuluElement {
    constructor(public readonly offsetY: number, public readonly lineNo: number) {
        super()
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.save()
        super.draw(ctx)
        ctx.translate(0, this.offsetY)
        ctx.beginPath();
        ctx.arc(0, 0, 13, 0, 2 * Math.PI);
        ctx.fillStyle = '#dda'
        ctx.fill();
        ctx.stroke()
        ctx.restore()
    }
}


export class InputLine {
    constructor(public readonly offsetY: number, public readonly lineNo: number) {

    }

    active = false

    updateMousePos(x: number, y: number): boolean {
        return this.active = y > this.offsetY - 10 && y < this.offsetY + 10
    }

    draw(ctx: CanvasRenderingContext2D, lineLength: number) {
        ctx.save()
        ctx.beginPath();
        if (this.active) {
            ctx.strokeStyle = `#3338`
            ctx.strokeRect(50, this.offsetY - 10, lineLength - 40, 20)
        }
        ctx.strokeStyle = '#ddd'
        ctx.moveTo(60, this.offsetY);
        ctx.lineTo(lineLength, this.offsetY);
        ctx.stroke()
        ctx.restore()
    }
}

