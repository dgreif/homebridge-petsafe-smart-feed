import { useEffect, useState } from 'react'
import '@homebridge/plugin-ui-utils/dist/ui.interface'

const { homebridge } = window

export default function TokenForm({
  onToken,
}: {
  onToken(token: string): any
}) {
  const [loading, setLoading] = useState(false),
    [sentCodeToEmail, setEmail] = useState('')

  useEffect(() => {
    if (loading) {
      homebridge.showSpinner()
    } else {
      homebridge.hideSpinner()
    }
  }, [loading])

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

      form.onSubmit(async ({ code }) => {
        setLoading(true)

        try {
          const { token } = await homebridge.request('/token', {
            email: sentCodeToEmail,
            code,
          })

          onToken(token)
        } catch (e: any) {
          // eslint-disable-next-line no-console
          console.error(e)
          homebridge.toast.error(e.message, 'Failed to Link Account')
        } finally {
          setLoading(false)
        }
      })

      form.onCancel(() => setEmail(''))
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

      form.onSubmit(async ({ email }) => {
        setLoading(true)

        try {
          await homebridge.request('/send-code', { email })
          setEmail(email)
        } catch (e: any) {
          // eslint-disable-next-line no-console
          console.error(e)
          homebridge.toast.error(e.message, 'Failed to Send Code')
        } finally {
          setLoading(false)
        }
      })
    }
  }, [onToken, sentCodeToEmail])

  return (
    <h4 className="text-center primary-text mb-3">Link Pet Safe Account</h4>
  )
}
