


const dec2bin = (dec: number) =>  dec.toString(2)


export class Table {
    max: number
    private data: string[][]
    constructor(bits: number, private container: HTMLDivElement) {
        this.max = Math.pow(2, bits)
        this.data = [
            ['input', 'output'],
            ['000', '000'],
            ['001', '010'],

        ]
    }

    update() {

    }

}



