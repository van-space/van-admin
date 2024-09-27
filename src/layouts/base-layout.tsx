import { InitialProvider } from '~/providers/initial-provider'

const BaseLayout = ({ children }) => {
  return <InitialProvider>{children}</InitialProvider>
}
export default BaseLayout
