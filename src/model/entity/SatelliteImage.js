// @flow strict

type Sensor = 'PLEIADES';
type ImageExtension = '.tif' | '.png';
type Bits = 8 | 16;
type Bands = 'RGB' | 'NRG' | 'RGBN';

export class SatelliteImage {
  bands: Bands;

  bits: Bits;

  extension: ImageExtension;

  filename: string;

  id: number;

  layer_name: string;

  sensor_name: Sensor;

  constructor(bands: Bands, bits: Bits, extension: ImageExtension, filename: string, id: number, layer_name: string, sensor_name: Sensor) {
    this.bands = bands;
    this.bits = bits;
    this.extension = extension;
    this.filename = filename;
    this.id = id;
    this.layer_name = layer_name;
    this.sensor_name = sensor_name;
  }
}
