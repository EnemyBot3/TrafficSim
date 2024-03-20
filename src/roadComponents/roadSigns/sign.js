import React from 'react'
import { Stop } from './stop'
import { Crossing } from './crossing'
import { Markings, Vehicles } from '../../utils/enums';
import { CarProjection } from './carProjection';
import { Target } from './target';
import { Traffic } from './traffic';

export function Sign({ type, center, direction, flipped, projection}) {

  return (
    <>
        { 
          type == Markings.Stop ? <Stop center={center} direction={direction} flipped={flipped} projection={projection}/> : 
          type == Markings.Crossing ? <Crossing center={center} direction={direction} flipped={flipped} projection={projection}/> : 
          type == Markings.Traffic ? <Traffic center={center} direction={direction} flipped={flipped} projection={projection}/> :
          type == Markings.Car ? <CarProjection center={center} direction={direction} flipped={flipped} projection={projection}/> :
          type == Markings.End ? <Target center={center} direction={direction} flipped={flipped} projection={projection}/> :<></>

        }
    </>
  )
}
