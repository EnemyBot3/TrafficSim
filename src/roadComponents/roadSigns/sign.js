import React from 'react'
import { Stop } from './stop'
import { Crossing } from './crossing'
import { Colors, Markings } from '../../utils/enums';
import { CarProjection } from './carProjection';
import { Target } from './target';
import { Start } from './start';
import { Traffic } from './traffic';

export function Sign({ type, center, direction, flipped, projection, target}) {

  return (
    <>
        { 
          type == Markings.Stop ? <Stop center={center} direction={direction} flipped={flipped} projection={projection}/> : 
          type == Markings.Crossing ? <Crossing center={center} direction={direction} flipped={flipped} projection={projection}/> : 
          type == Markings.Traffic ? <Traffic center={center} direction={direction} flipped={flipped} projection={projection} color={Colors.Red}/> :
          type == Markings.Car ? <CarProjection center={center} direction={direction} flipped={flipped} projection={projection} target={target}/> :
          type == Markings.Start ? <Start center={center} direction={direction} flipped={flipped} projection={projection} target={target}/> :
          type == Markings.End ? <Target center={center} direction={direction} flipped={flipped} projection={projection}/> :<></>
        }
    </>
  )
}
