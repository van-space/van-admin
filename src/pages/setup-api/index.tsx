import { useState } from 'react'

const storeApiUrlKey = 'mx-admin:setup-api:url'
const storeGatewayUrlKey = 'mx-admin:setup-api:gateway'
const historyApiUrl: string[] = JSON.safeParse(
  localStorage.getItem(storeApiUrlKey) || '[]',
)
const historyGatewayUrl: string[] = JSON.safeParse(
  localStorage.getItem(storeGatewayUrlKey) || '[]',
)
const SetupApi = () => {
  const [apiRecord, setApiRecord] = useState({
    apiUrl:
      localStorage.getItem('__api') ||
      `${location.protocol}//${location.host}/api/v2`,
    gatewayUrl:
      localStorage.getItem('__gateway') ||
      `${location.protocol}//${location.host}`,

    persist: true,
  })
  return <h1>SetupAPI</h1>
}

export default SetupApi
