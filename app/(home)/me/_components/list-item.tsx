import React from 'react'
import { Separator } from '@/components/ui/separator'

export default function ListItem(props: {
  icon: React.ReactNode,
  label: string,
  value: string,
}) {
  return <>
    <li>
      <div className={'flex justify-between items-center py-2'}>
        <div className={'flex'}>
          {props.icon}
          <span className={'pl-2'}>{props.label}</span>
        </div>
        <div>{props.value}</div>
      </div>
      <Separator />
    </li>
  </>
}
