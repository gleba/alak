/**
 * Ok1
 */
import { AFlow } from './core'

type MaybeAny<T> = unknown extends T ? any : T

/**
 *
 * Конструктор потока {@link core#AFlow} .

 * @public
 */
export declare const As : {
  <T>(v?: T): AFlow<MaybeAny<T>>
}
