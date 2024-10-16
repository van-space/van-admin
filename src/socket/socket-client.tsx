import io from 'socket.io-client'
import type { NotificationTypes } from './types'

import { configs } from '~/configs'
import { GATEWAY_URL } from '~/constants/env'
import { getToken } from '~/utils/auth'
import { bus } from '~/utils/event-bus'
import { BrowserNotification } from '~/utils/notification'

import { EventTypes } from './types'

const Notify = {
  get warning() {
    return window.message
  },
  get warn() {
    return window.message
  },
  get success() {
    return window.message.success
  },
  get error() {
    return window.message.error
  },
  get info() {
    return window.message
  },
}

export class SocketClient {
  #_socket!: ReturnType<typeof io>

  get socket() {
    return this.#_socket
  }

  #title = configs.title

  #notice = new BrowserNotification()

  #isInit = false

  initIO() {
    if (this.#isInit) {
      return
    }
    this.destory()
    const token = getToken()

    if (!token) {
      return
    }

    this.#_socket = io(`${GATEWAY_URL}/admin`, {
      timeout: 10000,
      transports: ['websocket'],
      forceNew: true,
      query: {
        token: token.replace(/^bearer\s/, ''),
      },
    })

    this.socket.on(
      'message',
      (payload: string | Record<'type' | 'data' | 'code', any>) => {
        if (typeof payload !== 'string') {
          return this.handleEvent(payload.type, payload.data, payload.code)
        }
        const { data, type, code } = JSON.parse(payload) as {
          data: any
          type: EventTypes
          code?: number
        }
        this.handleEvent(type, data, code)
      },
    )
  }
  handleEvent(type: EventTypes, payload: any, code?: number) {
    switch (type) {
      case EventTypes.GATEWAY_CONNECT: {
        break
      }
      case EventTypes.GATEWAY_DISCONNECT: {
        Notify.warning(payload)
        break
      }
      case EventTypes.AUTH_FAILED: {
        console.log('等待登录中...')
        this.socket.close()
        break
      }
      case EventTypes.COMMENT_CREATE: {
        const body = `${payload.author}: ${payload.text}`
        const handler = () => {
          window.location.hash = '/comment'
          window.message.dismiss()
        }
        window.message((_) => (
          <div>
            Custom and <b>bold</b>
            <button type="button" onClick={handler}>
              查看
            </button>
          </div>
        ))

        this.#notice.notice(`${this.#title} 收到新的评论`, body).then((no) => {
          if (!no) {
            return
          }
          no.addEventListener('click', () => {
            if (document.hasFocus()) {
              handler()
            } else {
              window.open(window.location.href)
            }
          })
        })
        break
      }
      case EventTypes.ADMIN_NOTIFICATION: {
        const { type, message } = payload as {
          type: NotificationTypes
          message: string
        }

        Notification[type]({ content: message })
        break
      }
      case EventTypes.CONTENT_REFRESH: {
        Notify.warning('数据库有变动，将在 1 秒后重载页面')
        setTimeout(() => {
          location.reload()
        }, 1000)
        break
      }
      case EventTypes.LINK_APPLY: {
        const sitename = payload.name

        const handler = () => {
          window.location.hash = '/friends?state=1'
          window.message.dismiss()
        }

        window.message((_) => (
          <div>
            新的友链申请
            <div>{sitename}</div>
            <button type="button" onClick={handler}>
              查看
            </button>
          </div>
        ))

        this.#notice
          .notice(`${this.#title} 收到新的友链申请`, sitename)
          .then((n) => {
            if (!n) {
              return
            }

            n.addEventListener('click', () => {
              if (document.hasFocus()) {
                handler()
              } else {
                // TODO
                window.open('/')
              }
            })
          })
        break
      }
      default: {
        if (__DEV__) {
          console.log(type, payload, code)
        }
      }
    }

    bus.emit(type, payload, code)
  }
  destory() {
    if (!this.socket) {
      return
    }
    this.socket.disconnect()
    this.socket.off('message')
    this.socket.offAny()

    this.#_socket = null!

    this.#isInit = false
  }
}
