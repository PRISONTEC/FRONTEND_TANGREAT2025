import { useState, useEffect, useContext, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { hookAxios } from '../hooks'
import { UserContext } from '../../context/UserContext';
import html2canvas from 'html2canvas';
import Excel from "./components/Excel"


const Grafico = () => {

    const { IPBACKEND, prefijo,dataGrafica } = useContext(UserContext);
    const { peticionGet } = hookAxios();
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [filterPosStart, setFilterPosStart] = useState(0)
    const [filterPosEnd, setFilterPosEnd] = useState(0)
    const [fhInicio, setFhInicio] = useState(1711491298);
    const [fhFin, setFhFin] = useState(1712932340);
    const [tramaInt, setTramaInt] = useState(135);
    const [selectedOption, setSelectedOption] = useState('potencia');
    const chartRef = useRef(null);

    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        getData()
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])

    const getData = async () => {
        const { count, items } = dataGrafica
        let data = items.map(({ potencia, fechaHoraReporte, voltaje, corriente, temperatura, vswr }) => {
            return {
                fechaHoraReporte,
                fecha: fechaHoraReporte,
                potencia: Number(potencia).toFixed(1),
                voltaje: Number(voltaje).toFixed(1),
                corriente: Number(corriente).toFixed(1),
                temperatura: Number(temperatura).toFixed(1),
                vswr: Number(vswr).toFixed(1),
            }
        })
        setData(data);
        setFilteredData(data);
        setFilterPosEnd(data.length)
    }


    function CustomTooltip({ payload, label, active }) {
        if (active) {
            return (
                <>
                    {payload ?
                        <div className="custom-tooltip bg-success rounded text-white opacity-75 p-2">
                            <p className="label">{`${selectedOption} : ${payload[0]?.payload[selectedOption]}`}</p>
                            <p className="intro">{`fecha : ${new Date(payload[0]?.payload?.fechaHoraReporte * 1000).toLocaleString()}`}</p>
                        </div> : null}
                </>
            );
        }

        return null;
    }

    const dataToExcel = () => {
        let dataExcel = data.map(({ potencia, fechaHoraReporte, voltaje, corriente, temperatura, vswr }) => {
            return {
                fecha: new Date(fechaHoraReporte * 1000).toLocaleString(),
                potencia: Number(potencia).toFixed(1),
                voltaje: Number(voltaje).toFixed(1),
                corriente: Number(corriente).toFixed(1),
                temperatura: Number(temperatura).toFixed(1),
                vswr: Number(vswr).toFixed(1),
            }
        })
        return dataExcel;
    }

    const exportToPNG = async () => {
        const canvas = await html2canvas(chartRef.current);
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'chart.png';
        link.href = imgData;
        link.click();
    };

    const handleResize = () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        });
    };

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };



    const zoomChart = (event) => {
        const rect = chartRef.current.getBoundingClientRect();
        const inicioX = rect.left; // Posición X de inicio del div
        const finX = rect.right; // Posición X de fin del div
        const posMouse = event.clientX; // Posición X del Mouse del div        

        const delta = event.deltaY;
        const columnas = 20
        let posStart = 0;
        let posEnd = 0;
        let newData = [];

        // Calcular el ancho de cada columna
        const anchoColumna = (finX - inicioX) / columnas;

        // Calcular en qué columna está el puntero del mouse
        let columnaMouse = Math.floor((posMouse - inicioX) / anchoColumna);
        //console.log({ inicioX, finX, x: event.clientX, columnaMouse })

        //ZOOM IN 
        if (delta < 0 && filteredData.length > 0) {
            const salto = Math.floor(filteredData.length / 20);

            posStart = Math.floor(salto*(columnaMouse/columnas));
            posEnd = filteredData.length - Math.floor(salto*(1-columnaMouse/columnas));

            newData = filteredData.slice(posStart, posEnd)
            setFilteredData(newData)

        //ZOOM OUT 
        } else {
            const salto = Math.floor(data.length / 5);
            posStart = filterPosStart -  salto;
            posEnd = filterPosEnd + salto;
            if (posStart < 0) posStart = 0;
            if (posEnd > data.length - 1) posEnd = data.length - 1;
            newData = data.slice(posStart, posEnd)

        }
        //console.log({ posStart, posEnd,  })
        setFilteredData(newData);
        setFilterPosStart(posStart);
        setFilterPosEnd(posEnd);
    };

    const CustomAxisX = ({ x, y, payload: { value } }) => {
        return (
            <g transform={`translate(${x},${y})`}>
                <text x={30} y={5} dy={4} textAnchor="end" fill="#666" transform="rotate(0)">
                    {new Date(value * 1000).toLocaleString().split(',')[1]}
                </text>
                <text x={30} y={20} dy={4} textAnchor="end" fill="#666" transform="rotate(0)">
                    {new Date(value * 1000).toLocaleString().split(',')[0]}
                </text>
            </g>
        );
    }

    return (
        <div ref={chartRef}>
            <div className='d-flex justify-content-center align-items-center'>
                <div className='col-3'>
                    <select name="labels" id="labels" className="form-select form-select-sm mb-3" style={{ width: "200px" }} value={selectedOption} onChange={handleSelectChange}>
                        <option value="potencia">Potencia</option>
                        <option value="voltaje">Voltaje</option>
                        <option value="corriente">Corriente</option>
                        <option value="temperatura">Temperatura</option>
                        <option value="vswr">VSWR</option>
                    </select>
                </div>
                {data.length > 0 ?
                    <>
                        <div className='col-2'>
                            <button type='button' className='btn btn-sm btn-primary' onClick={() => exportToPNG()}>
                                Exportar Gráfico
                            </button>
                        </div>
                        <div className='col-2'>
                            <Excel data={dataToExcel()} fileName="datos" />
                        </div>
                    </> : null}

            </div>
            <div  onWheel={zoomChart}>
                <LineChart
                    data={filteredData}
                    width={windowSize.width * 0.9}
                    height={windowSize.height * 0.7}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 55,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" tick={<CustomAxisX />} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />

                    <Line type="monotone" dataKey={selectedOption} stroke="#8884d8" />
                </LineChart>
            </div>
        </div>
    );
}

export default Grafico;