import React from 'react'


// FieldWrapper is a wrapper component that wraps around a form field and provides a label, validation, and error handling
type regex = RegExp
type validationError = string[]
type errorfn = regex|((value: any) => validationError|void)
type validator = errorfn|regex|'required'
interface QPFieldWrapper extends React.HTMLAttributes<HTMLFieldSetElement> {
  validators: validator|validator[]
  validateOn: 'blur'|'change'|'submit'
}
type validation = {
  success: boolean
  errors: validationError
}

function validate(value: string, validators: validator[]): validation {
  const newErrors = validators.map((validator) => {
    if (typeof validator === 'function') {
      const result = validator(value)
      if (Array.isArray(result)) {
        return result as validationError
      }
    } else if (Array.isArray(validator)) {
      return validator.map((v) => v(value)).filter((v) => v).join(' ')
    } else if (validator === 'required') {
      if (typeof value !== 'string' || value === '') return 'Value is required.'
    } else {
      if (validator.test(value)) return 'Value is invalid.'
    }
  })
  const errors = newErrors.flat().filter((error) => typeof error === 'string' && error !== '')
  return { success: errors.length === 0, errors } as validation
}



const FieldWrapper = (props: QPFieldWrapper) => {
  const validators: validator[] = Array.isArray(props.validators) ? props.validators : [props.validators]
  const [errors, setErrors] = React.useState<string[]>([])
  const [triggered, setTriggered] = React.useState<boolean>(false)
  const [value, setValue] = React.useState<string>('')
  const [valid, setValid] = React.useState<boolean>(true)
  const className = `qualia field-wrapper ${valid ? 'is-valid' : 'unvalidated'} ${props.className || ''}`

  const trigger = React.useCallback((evt: React.SyntheticEvent|Event) => {
    if (triggered) return
    setTriggered(true)
    const value = (evt.target as HTMLInputElement&HTMLTextAreaElement&HTMLSelectElement).value
    const result: validation = validate(value??'', validators)
    setErrors(result.errors)
    setValid(result.success)
    setTriggered(false)
  }, [triggered, validators, setErrors, setValid])

  const childs = Array.from([props.children]).flat() as React.ReactNode[]
  childs.forEach((child) => {
    if (typeof child !== 'object') return
    const c = child as React.ReactElement
    if (c.props && c.props instanceof Object) {
      var fn = 'onChange'
      switch(props.validateOn) {
        case 'blur': fn = 'onBlur'; break
        case 'change': fn = 'onChange'; break
        case 'submit': fn = 'onSubmit'; break
        default: break;
      }
      const cprop = c.props[fn]
      if (cprop) {
        c.props[fn] = (evt: React.SyntheticEvent|Event) => { cprop(evt); trigger(evt) } as React.EventHandler
      } else { c.props[fn] = trigger }
    }
  })

  React.useCallback((evt: React.SyntheticEvent|Event) => {
    if (!triggered) return { success: true, errors: [] } as validation
    const value = (evt.target as HTMLInputElement).value
    const validation = validate(value, validators)
    setErrors(validation.errors)
    setValid(validation.success)
  }, [triggered, validators, setErrors, setValid])

  const onBlur = React.useCallback((evt: React.SyntheticEvent|Event) => { if (props.validateOn === 'blur') trigger(evt) }, [props.validateOn, trigger])

  return (
    <fieldset className={className} onBlurCapture={onBlur}>
      {childs}
      <div className='qualia field-errors'>
        {errors.map((error, i) => <span key={i}>{error}</span>)}
      </div>
    </fieldset>
  )
}

export { FieldWrapper }
export type { QPFieldWrapper, validator, validation, validationError, errorfn, regex }
