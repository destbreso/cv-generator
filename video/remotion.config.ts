import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setCrf(17);
// Studio-range 4:2:0 with Rec. 709. Without the color space Remotion writes
// full-range yuvj420p, which some uploaders (LinkedIn) drop without an error.
Config.setPixelFormat('yuv420p');
Config.setColorSpace('bt709');
Config.setChromiumOpenGlRenderer('angle');
