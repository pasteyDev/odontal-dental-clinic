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
  const [author_name, setAuthorName] = useState(initial?.author_name ?? '')
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
     if (editor.isDestroyed) return 
    editor.commands.setContent(
      initial?.content ?? initial?.content_markdown ?? '',
    )
    setTitle(initial?.title ?? '')
    setSlug(initial?.slug ?? '')
    setExcerpt(initial?.excerpt ?? '')
    setHero(initial?.hero_image ?? '')
  }, [initial?.id, editor]) 

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
            author_name,
            content: contentJson,
            content_markdown: contentText,
            hero_image: hero,
          },
        })
      } else {
        await createPost({
          data: {
            title,
            slug,
            excerpt,
            author_name,
            content: contentJson,
            content_markdown: contentText,
            hero_image: hero,
          },
        })
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
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            Slug
          </label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="post-slug"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            Author
          </label>
          <Input
            value={author_name}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Author name"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          Excerpt
        </label>
        <Input
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Brief summary shown in listings…"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          Hero image
        </label>
        {hero ? (
          <div className="relative">
            <img
              src={hero}
              alt="Hero"
              className="h-40 w-full rounded-lg object-cover border border-border"
            />
            <label className="absolute bottom-2 right-2 cursor-pointer rounded-md bg-background/90 border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition">
              Replace
              <input
                className="hidden"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && handleHeroUpload(e.target.files[0])
                }
              />
            </label>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-8 text-center transition hover:bg-muted/70">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-muted-foreground"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="text-sm text-muted-foreground">
              Click to upload a hero image
            </span>
            <span className="text-xs text-muted-foreground/60">
              PNG, JPG up to 4 MB
            </span>
            <input
              className="hidden"
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleHeroUpload(e.target.files[0])
              }
            />
          </label>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          Content
        </label>

        <div className="flex flex-wrap items-center gap-1 rounded-t-lg border border-b-0 border-border bg-muted/40 px-2 py-1.5">
          {[
            {
              label: 'B',
              title: 'Bold',
              action: () => editor?.chain().focus().toggleBold().run(),
              className: 'font-bold',
            },
            {
              label: 'I',
              title: 'Italic',
              action: () => editor?.chain().focus().toggleItalic().run(),
              className: 'italic',
            },
            {
              label: 'H2',
              title: 'Heading 2',
              action: () =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run(),
            },
            {
              label: 'H3',
              title: 'Heading 3',
              action: () =>
                editor?.chain().focus().toggleHeading({ level: 3 }).run(),
            },
          ].map(({ label, title, action, className }) => (
            <button
              key={label}
              type="button"
              title={title}
              onClick={action}
              className={`h-7 min-w-[28px] rounded px-2 text-xs border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30 transition ${className ?? ''}`}
            >
              {label}
            </button>
          ))}

          <div className="mx-1 h-5 w-px bg-border" />

          <button
            type="button"
            title="Bullet list"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className="h-7 rounded px-2 text-xs border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30 transition"
          >
            • List
          </button>

          <label
            title="Insert image"
            className="flex h-7 cursor-pointer items-center rounded px-2 text-xs border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30 transition"
          >
            Image
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
            title="Insert link"
            onClick={() => {
              const url = prompt('Enter URL:')
              if (url) editor?.chain().focus().setLink({ href: url }).run()
            }}
            className="h-7 rounded px-2 text-xs border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30 transition"
          >
            Link
          </button>
        </div>

        <div className="min-h-[220px] rounded-b-lg border border-border bg-background p-3 text-sm [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px]">
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="flex items-center justify-end border-t border-border pt-4">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full px-6"
        >
          {saving ? 'Saving…' : initial?.id ? 'Update post' : 'Publish post'}
        </Button>
      </div>
    </div>
  )
}