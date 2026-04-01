import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

gsap.registerPlugin(ScrollTrigger);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DATA = [58, 62, 65, 63, 68, 72, 75, 79, 82, 85, 88, 91];

export function ChartImpact() {
  const sectionRef = useRef<HTMLElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        }
      }
    );
  }, []);

  const data = {
    labels: MONTHS,
    datasets: [
      {
        label: "Avg. Quality Score",
        data: DATA,
        fill: true,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(99, 179, 237, 0.35)");
          gradient.addColorStop(1, "rgba(99, 179, 237, 0)");
          return gradient;
        },
        borderColor: "#63B3ED",
        borderWidth: 2.5,
        pointBackgroundColor: "#1a1a2e",
        pointBorderColor: "#63B3ED",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: "#63B3ED",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: "easeInOutQuart" as const,
      delay: (context: any) => {
        let delay = 0;
        if (context.type === "data" && context.mode === "default") {
          delay = context.dataIndex * 150;
        }
        return delay;
      },
    },
    scales: {
      y: {
        min: 50,
        max: 100,
        grid: {
          color: "rgba(255, 255, 255, 0.08)",
          drawBorder: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
          font: {
            family: "monospace",
            size: 12,
          },
        },
        border: { display: false },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
          font: {
            family: "monospace",
            size: 12,
          },
        },
        border: { display: false },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#e2e8f0",
        bodyColor: "#94a3b8",
        borderColor: "#334155",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context: any) {
            return `Score: ${context.parsed.y}`;
          },
        },
      },
    },
  };

  return (
    <section ref={sectionRef} className="py-24 bg-bg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-fg">Code Quality, Improving Every Day</h2>
          <p className="text-lg text-muted-fg">
            Average code quality scores across all CODEYE users rise consistently after every review cycle
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-6 md:p-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-0.5 bg-fg"></div>
              <span className="text-sm font-medium text-muted-fg uppercase tracking-wider">Avg. Quality Score</span>
            </div>
            <div className="h-[400px] w-full">
              <Line ref={chartRef} data={data} options={options} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
