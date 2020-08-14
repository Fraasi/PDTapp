import React, { useState, useEffect } from 'react'
import { uptime, networkInterfaces } from 'os'
import { secondsToDHMS } from 'futility'
import si from 'systeminformation'
import './styles.css'
import { dummyData } from './dummy.js'

// update dummy data
// window.si = si
// si.getStaticData(data => console.log(data))

export default function Stats() {

  const [versions, setVersions] = useState(null)
  useEffect(() => {
    si.versions()
      .then((data) => {
        setVersions(data)
      })
  }, [])

  const cell = Object.keys(networkInterfaces())[0]
  const { address, mac, family } = networkInterfaces()[cell][0]
  const { baseboard, cpu, os } = dummyData

  const filteredVersions = versions
    ? Object.keys(versions)
        .filter(key => !(versions[key] === ''))
        .map(key => (<li key={key}>{key}: {versions[key]}</li>))
    : [(<li key={1}>Collecting data...</li>)]

  return (
    <div className="view-container" id="stats">
      <div className="systeminfo">
        <fieldset>
          <legend>System information</legend>
          <details>
            <summary>{baseboard.model}</summary>
            <ul>
              <li>manufacturer: {cpu.manufacturer}</li>
              <li>brand: {cpu.brand}</li>
              <li>model: {cpu.model}</li>
              <li>processors: {cpu.processors}</li>
              <li>cores: {cpu.cores}</li>
              <li>speed: {cpu.speed}</li>
            </ul>
          </details>

          <details>
            <summary>{os.hostname}</summary>
            <ul>
              <li>{os.platform} {os.arch}</li>
              <li>distro: {os.distro}</li>
              <li>release: {os.release}</li>
              <li>serial: {os.serial}</li>
            </ul>
          </details>

          <details>
            <summary>Versions</summary>
            <ul>
              { filteredVersions }
            </ul>
          </details>
        </fieldset>
      </div>


      <div className="uppity">
        <fieldset>
          <legend>Node os</legend>
          {`${family}: ${address}  -  ${mac}`}
          <br />
          {`Uptime: ${secondsToDHMS(uptime(), true)}`}
        </fieldset>
      </div>

    </div>
  )
}
