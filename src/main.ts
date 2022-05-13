import { Circit } from './elements'
import './index.css'
import './style.css'
import { Table } from './table'
import { createApp } from 'vue'
import App from './App.vue'






const tableContainer = document.querySelector<HTMLDivElement>('#table')!

const canvas = document.createElement('canvas')

canvas.width = window.innerWidth
canvas.height = 300
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
const circit = new Circit(4)


const table = new Table(4, tableContainer)

// app.appendChild(canvas)



const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#333' 
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    circit.draw(ctx)
    requestAnimationFrame(draw)
}

draw()


createApp(App).mount('#app')
