import { useMemo, useState } from 'react'
import { Transition } from "@headlessui/react"
import { useStat } from "../api/useStat"
import { useUser } from '@/lib/auth'
import moment from 'moment'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type StatProps = {
  name: string
}

const transitionProps = {
  enter: "transition-opacity duration-300",
  enterFrom: "opacity-0 transform -translate-y-2",
  enterTo: "opacity-100 transform translate-y-0",
  leave: "transition-opacity duration-150",
  leaveFrom: "opacity-100 transform translate-y-0",
  leaveTo: "opacity-0 transform -translate-y-2"
}

export const SLStat: React.FC<StatProps> = ({ name }) => {
  const statQuery = useStat({ name })
  const user = useUser();

  console.log(statQuery.data)

  const labels = useMemo(() => {
    const creationDate = moment(user.data?.createdAt);

    // Generate labels from creation date to present day
    const labels = [];
    const currentDate = moment();
    let currentDateIterator = moment(creationDate);

    while (currentDateIterator.isSameOrBefore(currentDate, 'day')) {
      // in format %Y-%m-%d
      labels.push(currentDateIterator.format('YYYY-MM-DD'));
      currentDateIterator.add(1, 'day');
    }

    return labels
  }, [user])

  const data = useMemo(() => {
    if (!statQuery.isSuccess) {
      return undefined
    }

    // Dynamically generate color using HSL
    let hue = 5;

    const datasets = statQuery.data?.activities.map((ac) => {
      const data = labels.map((label) => {
        const found = ac.timeline.find((d) => d.date === label);
        return found?.visits || 0;
      })

      hue  = (hue + 10) % 360;

      return {
        label: ac.ip,
        data,
        fill: false,
        borderColor: `hsl(${hue}, 100%, 50%)`,
        tension: 0.1
      }
    });

    return {
      labels,
      datasets
    }
  }, [statQuery.isSuccess, statQuery.data, labels])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Visits for ${name}`,
      },
    },
  };

  return (
    <>
      <Transition
        show={statQuery.isSuccess}
        {...transitionProps}
      >
        {data && <Line data={data} options={options} />}
      </Transition>
    </>
  )
}