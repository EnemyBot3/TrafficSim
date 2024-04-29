import React from 'react'
import Car from './car'
import { samePoint } from '../utils/math'

export default function Garage({vehicles, setVehicles}) {

    const update = (oldPosition, newVehicles) => {
        setVehicles(oldvehicles => oldvehicles.map((car) => {
            if (!car.deleted && samePoint(car.position, oldPosition)) { 
                return {...car, position: newVehicles.position, rotation: newVehicles.rotation, hitbox: newVehicles.hitbox} 
            } 
            return car
        }))

    }

    return (
    <>
        {vehicles.map((car, index) => 
           !car.deleted && <Car 
                key={index} 
                position={car.position}
                rotation={car.rotation} 
                color={car.color} 
                target={car.target}
                direction={car.direction}
                origin={car.origin}
                update={update}/>)} 
    </> 
    )
}
