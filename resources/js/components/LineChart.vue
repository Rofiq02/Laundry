<script>
import { Line } from 'vue-chartjs'

export default {
    extends: Line,
    props: ['data', 'options', 'labels'], //meminta data sebagai props
    mounted(){
        this.lineRenderChart() //ketika component di load maka method ini dijalankan
    },
    watch: {
        //ketika terjadi perubahan value dari props data
        data: {
            handler(){
                this._data._chart.destry() //maka hapus chart
                this.lineRenderChart() // dan render kembali dengan data yg baru
            },
            deep: true
        }
    },
    methods: {
        lineRenderChart(){
            //fungsi untuk merender chart
            this.renderChart({
                labels: this.labels, //label berdasarkan prop label
                dataset: [{
                    label: 'Data Transaksi',
                    data: this.data, //data yg akan menjadi chart
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                    ],
                    borderWidth: 1
                }]
            }, this.options)
        }
    }
}
</script>
