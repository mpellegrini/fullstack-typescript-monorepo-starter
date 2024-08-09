declare const tag: unique symbol

export interface TagContainer<Token> {
  readonly [tag]: Token
}

type Tag<Token extends PropertyKey, TagMetadata> = TagContainer<{
  [K in Token]: TagMetadata
}>

export type Tagged<Type, TagName extends PropertyKey, TagMetadata = never> = Tag<
  TagName,
  TagMetadata
> &
  Type

export type UnwrapTagged<TaggedType extends Tag<PropertyKey, unknown>> = RemoveAllTags<TaggedType>

type RemoveAllTags<T> =
  T extends Tag<PropertyKey, unknown>
    ? {
        [ThisTag in keyof T[typeof tag]]: T extends Tagged<
          infer Type,
          ThisTag,
          T[typeof tag][ThisTag]
        >
          ? RemoveAllTags<Type>
          : never
      }[keyof T[typeof tag]]
    : T
