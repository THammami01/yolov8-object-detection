import type { FC } from 'react';
import { Card, Skeleton } from '@nextui-org/react';
import { InfoCardsType } from '../App';

interface InfoCardProps {
  isLoading: boolean;
  infoCardsData: InfoCardsType;
}

const InfoCard: FC<InfoCardProps> = ({ isLoading, infoCardsData }) => {
  const data = [
    {
      label: 'Total number of detections',
      value: infoCardsData.totalNbOfDetections,
    },
    {
      label: 'Avg. confidence score',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: isNaN(infoCardsData.avgConfidenceScore as any)
        ? 0
        : infoCardsData.avgConfidenceScore,
    },
    {
      label: 'Avg. match count per image',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: isNaN(infoCardsData.avgMatchCountPerImage as any)
        ? 0
        : infoCardsData.avgMatchCountPerImage,
    },
  ];

  return (
    <div className="flex gap-4">
      {data.map(({ label, value }) => (
        <Card key={label} className="w-full p-4 space-y-2" radius="lg">
          <h4 className="font-bold text-large">{label}</h4>

          <Skeleton className="w-3/5 rounded-lg" isLoaded={!isLoading}>
            <div
              className={`h-8 w-3/5 rounded-lg ${
                isLoading ? 'bg-default-200' : ''
              } text-2xl font-bold`}
            >
              {value}
            </div>
          </Skeleton>
        </Card>
      ))}
    </div>
  );
};

export default InfoCard;
