import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { debounce } from 'lodash-es'

import { uiSlice } from '~/store/slice/ui.slice'

const LayoutProvider = ({ children }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    const resizeHandler = debounce(
      () => dispatch(uiSlice.actions.updateViewport()),
      500,
      { trailing: true },
    )
    window.addEventListener('resize', resizeHandler)
    dispatch(uiSlice.actions.updateViewport())
    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [dispatch])
  return children
}

export default LayoutProvider
