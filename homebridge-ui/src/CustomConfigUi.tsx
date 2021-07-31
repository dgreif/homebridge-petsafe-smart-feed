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
      <button
        className="btn btn-link m-0 p-0"
        onClick={() => setShowTokenForm(true)}
      >
        <i className="fa fa-redo mr-2"></i>
        Generate New Auth Token
      </button>
    </>
  )
}
