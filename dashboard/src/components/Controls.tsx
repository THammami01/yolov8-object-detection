import type { FC } from 'react';
import { Slider, Select, SelectItem } from '@nextui-org/react';

const models = ['yolov8s'];

interface ControlsProps {
}

const Controls: FC<ControlsProps> = () => {
  return (
    <div className="flex justify-end gap-8">
      <Slider
        color="foreground"
        label="Min. confidence score"
        step={0.1}
        maxValue={1}
        minValue={0}
        defaultValue={0}
        className="max-w-[180px]"
        isDisabled
      />

      <Select
        size="md"
        label="Selected model"
        placeholder="Select a model"
        className="max-w-[200px]"
        selectedKeys={['yolov8s']}
      >
        {models.map((model) => (
          <SelectItem key={model} value={model}>
            {model}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default Controls;
