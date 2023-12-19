import { useState, type FC, useEffect } from 'react';
import { Navbar, NavbarBrand } from '@nextui-org/react';
import { InfoCards, Controls, DataAccordion } from './components';
import axios from 'axios';

export type InfoCardsType = {
  totalNbOfDetections: string | number;
  avgConfidenceScore: string | number;
  avgMatchCountPerImage: string | number;
};

export type AccordoanItemImageType = {
  timestamp: number | string;
  confidence_score: number | string;
  match_count: number | string;
  model_name: 'yolov8s';
};

export type AccordionItemType = {
  key: string;
  title: string;
  totalNbOfDetections: number | string;
  avgConfidenceScore: number | string;
  avgMatchCountPerImage: number | string;
  images: AccordoanItemImageType[];
};

interface AppProps {}

const App: FC<AppProps> = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [accordionData, setAccordionData] = useState<AccordionItemType[]>([]);
  const [infoCardsData, setInfoCardsData] = useState<InfoCardsType>({
    totalNbOfDetections: 0,
    avgConfidenceScore: 0,
    avgMatchCountPerImage: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      axios
        .get('http://localhost:5000/data')
        .then((res) => {
          const totalNbOfDetections = res.data.reduce(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (acc: number, curr: any) => acc + Number(curr.match_count),
            0
          );

          const avgConfidenceScore = (
            res.data.reduce(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (acc: number, curr: any) => acc + Number(curr.confidence_score),
              0
            ) / res.data.length
          ).toFixed(2);

          const avgMatchCountPerImage = (
            Number(totalNbOfDetections) / res.data.length
          ).toFixed(2);

          setInfoCardsData({
            totalNbOfDetections,
            avgConfidenceScore,
            avgMatchCountPerImage,
          });

          const tempAccordionData: AccordionItemType[] = [
            // {
            //   key: '1',
            //   title: 'This day',
            //   totalNbOfDetections: 0,
            //   avgConfidenceScore: 0,
            //   avgMatchCountPerImage: 0,
            //   images: [],
            // },
            // {
            //   key: '2',
            //   title: 'This week',
            //   totalNbOfDetections: 0,
            //   avgConfidenceScore: 0,
            //   avgMatchCountPerImage: 0,
            //   images: [],
            // },
            // {
            //   key: '3',
            //   title: 'This month',
            //   totalNbOfDetections: 0,
            //   avgConfidenceScore: 0,
            //   avgMatchCountPerImage: 0,
            //   images: [],
            // },
            {
              key: '4',
              title: 'All time',
              totalNbOfDetections,
              avgConfidenceScore,
              avgMatchCountPerImage,
              images: res.data,
            },
          ];

          setAccordionData(tempAccordionData);
          setIsLoading(false);
        })
        .catch(() => {
          alert('Error occured.');
          setIsLoading(false);
        });
    }, 2000);
  }, []);

  return (
    <div>
      <Navbar shouldHideOnScroll>
        <NavbarBrand>
          <p className="ml-3 font-bold text-inherit">
            Yolo v8 Object Detection
          </p>
        </NavbarBrand>
      </Navbar>

      <div className="max-w-[900px] my-12 mx-auto flex flex-col	gap-8 pb-12">
        <InfoCards isLoading={isLoading} infoCardsData={infoCardsData} />
        <Controls />
        <DataAccordion isLoading={isLoading} accordionData={accordionData} />
      </div>
    </div>
  );
};

export default App;
