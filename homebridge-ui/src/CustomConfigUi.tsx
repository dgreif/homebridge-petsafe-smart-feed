import { useEffect, useState } from 'react'
import '@homebridge/plugin-ui-utils/dist/ui.interface'
import TokenForm from './TokenForm'
const { homebridge } = window

function getConfigs() {
  return homebridge.getPluginConfig()
}

export default function CustomConfigUi() {
  const [showTokenForm, setShowTokenForm] = useState(false)

  useEffect(() => {
    if (showTokenForm) {
      homebridge.hideSchemaForm()
    } else {
      homebridge.showSchemaForm()
    }
  }, [showTokenForm])

  useEffect(() => {
    getConfigs().then((configs) => {
      const needToken = !configs[0]?.token
      setShowTokenForm(needToken)
    })
  }, [])

  async function onToken(token: string) {
    const [config, ...otherConfigs] = await getConfigs()
    await homebridge.updatePluginConfig([{ ...config, token }, ...otherConfigs])
    homebridge.toast.success('Auth Token Updated', 'Pet Safe Login Successful')
    setShowTokenForm(false)
  }

  return showTokenForm ? (
    <TokenForm onToken={onToken}></TokenForm>
  ) : (
    <>
      <h4 className="text-center primary-text mb-3">Pet Safe Smart Feed</h4>
      <button className="btn btn-link" onClick={() => setShowTokenForm(true)}>
        Link to new account
      </button>
    </>
  )
}
