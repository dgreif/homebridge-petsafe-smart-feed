import { SyntheticEvent, useEffect, useState } from 'react'
import '@homebridge/plugin-ui-utils/dist/ui.interface'

const { homebridge } = window

export default function TokenForm({
  onToken,
}: {
  onToken(token: string): any
}) {
  const [loading, setLoading] = useState(false)
  const [sentCodeToEmail, setEmail] = useState('')
  const haveSentEmail = Boolean(sentCodeToEmail)

  useEffect(() => {
    if (loading) {
      homebridge.showSpinner()
    } else {
      homebridge.hideSpinner()
    }
  }, [loading])

  async function sendCode(email: string) {
    setLoading(true)

    try {
      await homebridge.request('/send-code', { email })
      setEmail(email)
    } catch (e) {
      homebridge.toast.error(e.message, 'Failed to Send Code')
    } finally {
      setLoading(false)
    }
  }

  async function getToken(email: string, code: string) {
    try {
      const { token } = await homebridge.request('/token', {
        email: sentCodeToEmail,
        code,
      })

      onToken(token)
    } catch (e) {
      console.error(e)
      homebridge.toast.error(e.message, 'Failed to Link Account')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (sentCodeToEmail) {
      const form = homebridge.createForm(
        {
          schema: {
            type: 'object',
            properties: {
              code: {
                title: 'Code',
                type: 'string',
                required: true,
                description: `Please enter the code sent to ${sentCodeToEmail}`,
              },
            },
          },
        },
        {},
        'Link Account',
        'Change Email'
      )

      form.onSubmit((form) => {
        getToken(sentCodeToEmail, form.code)
      })

      form.onCancel(() => {
        setEmail('')
      })
      form.onChange(() => {})
    } else {
      const form = homebridge.createForm(
        {
          schema: {
            type: 'object',
            properties: {
              email: {
                title: 'Email',
                type: 'string',
                format: 'email',
                required: true,
              },
            },
          },
        },
        {},
        'Send Auth Code'
      )

      form.onSubmit((form) => {
        console.log('FORM', form)
        sendCode(form.email)
      })

      // form.onCancel(() => {
      //   setEmail('')
      // })
      form.onChange(() => {})
    }
  }, [sentCodeToEmail])

  return (
    <h4 className="text-center primary-text mb-3">Link Pet Safe Account</h4>
    // <div className="d-flex justify-content-center">
    //   <div className="col-lg-6">
    //     <form onSubmit={handleSubmit}>
    //       <h4 className="text-center primary-text mb-3">
    //         Link Pet Safe Account
    //       </h4>
    //       <div className="card p-3">
    //         <div className="form-group">
    //           <label htmlFor="petSafeEmail">Email</label>
    //           <input
    //             type="email"
    //             id="petSafeEmail"
    //             autoCorrect="off"
    //             autoCapitalize="off"
    //             spellCheck="false"
    //             className="form-control"
    //             required={true}
    //             autoFocus={true}
    //             disabled={loading || haveSentEmail}
    //           />
    //         </div>
    //         {haveSentEmail ? (
    //           <div className="form-group">
    //             <label htmlFor="petSafeCode" className="active">
    //               Code
    //             </label>
    //             <input
    //               type="text"
    //               id="petSafeCode"
    //               autoComplete="off"
    //               autoCorrect="off"
    //               autoCapitalize="off"
    //               spellCheck="false"
    //               className="form-control"
    //               required={true}
    //               autoFocus={true}
    //               disabled={loading}
    //             />
    //             <small className="form-text text-muted">
    //               Please enter the code sent to {sentCodeToEmail}
    //             </small>
    //           </div>
    //         ) : (
    //           ''
    //         )}
    //         <div className="text-center">
    //           <button
    //             type="submit"
    //             className="btn btn-primary"
    //             disabled={loading}
    //           >
    //             {haveSentEmail ? 'Link Account' : 'Send Auth Code'}
    //           </button>
    //         </div>
    //       </div>
    //     </form>
    //   </div>
    // </div>
  )
}