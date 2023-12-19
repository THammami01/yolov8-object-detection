import { useState, type FC } from 'react';
import {
  Accordion,
  AccordionItem,
  Card,
  CardHeader,
  CardBody,
  Image,
  Progress,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  ModalHeader,
  Divider,
} from '@nextui-org/react';

import moment from 'moment';
import { AccordionItemType, AccordoanItemImageType } from '../App';

interface DataAccordionItemProps {
  data: AccordionItemType;
  handleOpenImage: (image: AccordoanItemImageType) => void;
}

const DataAccordionItem: FC<DataAccordionItemProps> = ({
  data,
  handleOpenImage,
}) => {
  if (!data.images.length)
    return (
      <div className="pb-4 font-normal text-gray-400">
        <p>No detections</p>
      </div>
    );

  return (
    <div className="pb-4 font-normal">
      <p>Number of detections: {data.totalNbOfDetections}</p>
      <p>Average confidence score: {data.avgConfidenceScore}</p>
      <p>Average match count per image: {data.avgMatchCountPerImage}</p>

      <div className="grid justify-between grid-cols-3 gap-2 mt-4">
        {data.images.map((image) => {
          const imageURL = `http://localhost:5000/images/${image.timestamp}`;
          const readableDate = moment(+image.timestamp * 1000).format(
            'MMMM Do YYYY, H:mm:ss'
          );

          return (
            <Card className="py-2" key={image.timestamp}>
              <CardHeader className="flex-col items-start px-4 pt-2 pb-0">
                <p className="text-tiny">{readableDate}</p>
                <p className="mt-1 text-gray-400 text-tiny">
                  Class: Person - Score: {image.confidence_score} - Count:{' '}
                  {image.match_count}
                </p>
              </CardHeader>

              <CardBody className="py-2 overflow-visible">
                <Image
                  alt="Captured"
                  className="object-cover cursor-pointer rounded-xl"
                  src={imageURL}
                  isZoomed
                  onClick={() => handleOpenImage(image)}
                />
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

interface DataAccordionProps {
  accordionData: AccordionItemType[];
  isLoading: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DataAccordion: FC<DataAccordionProps> = ({
  accordionData,
  isLoading,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] =
    useState<null | AccordoanItemImageType>(null);

  const handleOpenImage = (image: AccordoanItemImageType) => {
    setSelectedImage(image);
    onOpen();
  };

  if (isLoading)
    return (
      <Progress
        size="sm"
        color="default"
        isIndeterminate
        aria-label="Loading..."
        className="max-w-md mx-auto"
      />
    );

  return (
    <>
      <Accordion
        variant="bordered"
        selectionMode="multiple"
        defaultExpandedKeys={['4']}
      >
        {accordionData.map((data) => (
          <AccordionItem
            key={data.key}
            title={data.title}
            className="font-medium"
          >
            <DataAccordionItem
              key={data.key}
              data={data}
              handleOpenImage={handleOpenImage}
            />
          </AccordionItem>
        ))}
      </Accordion>

      <Modal
        size="2xl"
        isOpen={isOpen}
        onClose={onClose}
        backdrop="blur"
        className="dark text-foreground"
      >
        <ModalContent>
          {() => {
            if (!selectedImage) return null;

            const imageURL = `http://localhost:5000/images/${selectedImage?.timestamp}`;
            const readableDate = moment(+selectedImage.timestamp * 1000).format(
              'MMMM Do YYYY, H:mm:ss'
            );

            return (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {readableDate}
                </ModalHeader>
                <ModalBody>
                  <Image
                    alt="Captured"
                    className="rounded-xl"
                    src={imageURL}
                    width={640}
                    height={480}
                  />

                  <Divider />

                  <div className="flex items-center h-6 mb-2 space-x-4 text-small">
                    <div>Model: {selectedImage.model_name}</div>
                    <Divider orientation="vertical" />
                    <div>Class: Person</div>
                    <Divider orientation="vertical" />
                    <div>
                      Confidence score: {selectedImage.confidence_score}
                    </div>
                    <Divider orientation="vertical" />
                    <div>Match count: {selectedImage.match_count}</div>
                  </div>
                </ModalBody>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DataAccordion;
