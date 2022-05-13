<template>
    <div class="">
        <canvas ref="canvas" class="bg-slate-400 block w-full h-[300px]"></canvas>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { AppState } from './data';

export default defineComponent({
    data() {
        return {
            ctx: {} as CanvasRenderingContext2D,
        }
    },
    methods: {
        draw() {
            const canvas = (this.$refs.canvas as HTMLCanvasElement)

            this.ctx.clearRect(0, 0, canvas.width, canvas.height)
            AppState.circuit.draw(this.ctx)
        },
        updateCanvasDimention() {
            const canvas = (this.$refs.canvas as HTMLCanvasElement)
            canvas.width = canvas.scrollWidth
            canvas.height = canvas.scrollHeight
            AppState.circuit.setDimention(canvas.width, canvas.height)

            this.draw()
        }
    },
    mounted() {
        const canvas = (this.$refs.canvas as HTMLCanvasElement)

        this.ctx = canvas.getContext("2d")!;
        window.addEventListener('resize', (e) => {
            this.updateCanvasDimention()
        })
        this.updateCanvasDimention()
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const { clientX, clientY } = { clientX: e.clientX - rect.left, clientY: e.clientY - rect.top}

            AppState.circuit.updateMousePos(clientX, clientY)
            this.draw()
        })
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const { clientX, clientY } = { clientX: e.clientX - rect.left, clientY: e.clientY - rect.top}

            AppState.circuit.onClick(clientX, clientY)
            this.draw()
        })
    },
})
</script>

