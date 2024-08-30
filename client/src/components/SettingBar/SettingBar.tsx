import React from 'react'
import './SettingBar.scss';

import { toolState } from '../../store';

const SettingBar: React.FC = () => {
  return ( 
    <div className='setting-bar'>
      <label htmlFor="line-width">Line Width:</label>
      <input
        onChange={e => toolState.setLineWidth(parseInt(e.target.value))}
        id="line-width"
        className='line-width'
        type="number" 
        defaultValue={1} 
        min={1} 
        max={50} 
      />
      <label htmlFor="stroke-color">Stroke Color:</label>
      <input
        onChange={e => toolState.setStrokeColor(e.target.value)}
        id="stroke-color"
        className='stroke-color'
        type="color"
      />
    </div>
   );
}
 
export default SettingBar;