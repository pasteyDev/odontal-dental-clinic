import React, { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createPost, updatePost, uploadBlogImage } from '@/lib/blog.functions'

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function BlogEditorClient({
  initial,
  onSaved,
}: {
  initial?: any
  onSaved?: () => void
}) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? '')
  const [hero, setHero] = useState(initial?.hero_image ?? '')
  const [saving, setSaving] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: { openOnClick: true } }),
      Image,
      Placeholder.configure({ placeholder: 'Write your article...' }),
    ],
    content: initial?.content ?? initial?.content_markdown ?? '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none min-h-[240px] focus:outline-none',
      },
    },
  })

  useEffect(() => {
    if (!editor) return
    editor.commands.setContent(
      initial?.content ?? initial?.content_markdown ?? '',
    )
    setTitle(initial?.title ?? '')
    setSlug(initial?.slug ?? '')
    setExcerpt(initial?.excerpt ?? '')
    setHero(initial?.hero_image ?? '')
  }, [initial, editor])

  async function handleInsertImage(file: File) {
    const base64 = await fileToBase64(file)
    const filename = `${Date.now()}_${file.name}`
    try {
      const res: any = await uploadBlogImage({
        data: {
          filename,
          base64,
          contentType: file.type,
        },
      })
      if (res?.publicUrl)
        editor?.chain().focus().setImage({ src: res.publicUrl }).run()
      else console.error('uploadBlogImage returned no publicUrl', res)
    } catch (e) {
      console.error('uploadBlogImage failed', e)
      alert((e as any)?.message ?? 'Upload failed')
    }
  }

  async function handleHeroUpload(file: File) {
    const base64 = await fileToBase64(file)
    const filename = `${Date.now()}_${file.name}`
    try {
      const res: any = await uploadBlogImage({
        data: {
          filename,
          base64,
          contentType: file.type,
        },
      })
      if (res?.publicUrl) setHero(res.publicUrl)
      else console.error('uploadBlogImage returned no publicUrl', res)
    } catch (e) {
      console.error('uploadBlogImage failed', e)
      alert((e as any)?.message ?? 'Upload failed')
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const contentJson = editor?.getJSON()
      const contentText = editor?.getText() ?? ''
      if (initial?.id) {
        await updatePost({
  data: {
    id: initial.id,
    title,
    slug,
    excerpt,
    content: contentJson,
    content_markdown: contentText,
    hero_image: hero,
  },
});
      } else {
        await createPost({
  data: {
    title,
    slug,
    excerpt,
    content: contentJson,
    content_markdown: contentText,
    hero_image: hero,
  },
});
      }
      onSaved?.()
    } catch (e) {
      console.error(e)
      alert((e as any)?.message ?? 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <Input
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        placeholder="Slug (unique)"
      />
      <Input
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        placeholder="Excerpt"
      />

      <div>
        <label className="block text-sm font-medium">Hero image</label>
        {hero ? (
          <img
            src={hero}
            alt="Hero"
            className="mt-2 w-full max-h-48 object-cover"
          />
        ) : null}
        <input
          className="mt-2"
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files && handleHeroUpload(e.target.files[0])
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Content</label>

        <div className="mt-2 mb-2 flex flex-wrap gap-2">
          <button
            type="button"
            className="btn"
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            Bold
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            Italic
          </button>
          <button
            type="button"
            className="btn"
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            Bullet
          </button>
          <label className="btn inline-flex items-center">
            <span>Insert image</span>
            <input
              className="hidden"
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleInsertImage(e.target.files[0])
              }
            />
          </label>
          <button
            type="button"
            className="btn"
            onClick={() => {
              const url = prompt('Enter URL:')
              if (url) editor?.chain().focus().setLink({ href: url }).run()
            }}
          >
            Link
          </button>
        </div>

        <div className="rounded border p-3 bg-white">
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={handleSave} disabled={saving}>
          {initial?.id ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  )
}
