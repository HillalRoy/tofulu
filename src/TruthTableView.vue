<script lang="ts">
import { computed, ComputedRef, ref } from "@vue/reactivity";
import { reactive, defineComponent, watchEffect } from "vue";
import TableLite from "vue3-table-lite/ts"
import { AppState } from "./data";
import { TableLiteColumn } from "./Table";

const inputCol = {
  label: "Input",
  field: "input",
  isKey: true,
}
const outputCol = {
  label: "Output",
  field: "output",
}

export default defineComponent({
  props: {
    nbits: {
      type: Number,
      default: 4,
    },


  },
  components: {
    TableLite
  },
  data() {
    return {
      rows: [{ input: "0", output: "0" }] as any[],
      totalRecordCount: 0,
      columns: [inputCol, outputCol] as TableLiteColumn[],
      isLoading: false,
    }
  },
  methods: {
    getOutput(input: number): number {
      return input & 1;
    },
    rowClick(e: any){
        AppState.currentInput = e['step1']
    }
  },
  mounted() {
    const max = Math.pow(2, this.nbits);
    this.rows = []

    watchEffect(() => {
        this.columns = Array(AppState.circuit.gates.length + 1).fill({}).map((_, i): TableLiteColumn => {
        return {
          label: i === 0 ? `Input` : i === AppState.circuit.gates.length  ? `Output` : `Step ${i}`,
          field: `step${i +1}`,
        }
      })
      this.rows = []
      for (let i = 0; i < max; i++) {
        const inputStr = i.toString(2).padStart(this.nbits, "0")
        const res = AppState.circuit.eval(inputStr)
        const row = {} as any
        for (let j = 0; j < res.length; j++) {
          row[`step${j + 1}`] = res[j]
        }
        this.rows.push(row)
      }

    })

  }

})

</script>

<template>
  <div>
    <table-lite :is-loading="isLoading" :columns="columns" :rows="rows" :total="totalRecordCount"
      @is-finished="isLoading = false" @row-clicked="rowClick" />
  </div>
</template>

<style>

</style>
