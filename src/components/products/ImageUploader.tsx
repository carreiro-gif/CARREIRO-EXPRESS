// src/components/products/ImageUploader.tsx
// Upload de imagens do PC (jpg, png, bmp)

import React, { useRef, useState } from 'react'

interface ImageUploaderProps {
  currentImageUrl?: string
  onImageChange: (imageData: string) => void
  label?: string
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  currentImageUrl, 
  onImageChange,
  label = 'Imagem do Produto'
}) => {
  const [preview, setPreview] = useState<string>(currentImageUrl || '')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp']
    if (!validTypes.includes(file.type)) {
      alert('Formato inválido! Use apenas JPG, PNG ou BMP.')
      return
    }

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert('Imagem muito grande! Máximo 5MB.')
      return
    }

    setLoading(true)

    try {
      // Converter para base64
      const reader = new FileReader()
      
      reader.onload = (event) => {
        const base64String = event.target?.result as string
        setPreview(base64String)
        onImageChange(base64String)
        setLoading(false)
      }

      reader.onerror = () => {
        alert('Erro ao carregar imagem!')
        setLoading(false)
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Erro ao processar imagem:', error)
      alert('Erro ao processar imagem!')
      setLoading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreview('')
    onImageChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div style={styles.container}>
      <label style={styles.label}>{label}</label>
      
      {/* Preview da Imagem */}
      {preview ? (
        <div style={styles.previewContainer}>
          <img 
            src={preview} 
            alt="Preview" 
            style={styles.previewImage}
          />
          <div style={styles.previewOverlay}>
            <button
              type="button"
              onClick={handleButtonClick}
              style={styles.changeButton}
            >
              📷 Trocar Imagem
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              style={styles.removeButton}
            >
              🗑️ Remover
            </button>
          </div>
        </div>
      ) : (
        /* Área de Upload */
        <div style={styles.uploadArea} onClick={handleButtonClick}>
          {loading ? (
            <div style={styles.loading}>
              <div style={styles.spinner} />
              <p>Carregando...</p>
            </div>
          ) : (
            <>
              <div style={styles.uploadIcon}>📷</div>
              <p style={styles.uploadText}>Clique para adicionar imagem</p>
              <p style={styles.uploadHint}>JPG, PNG ou BMP (máx. 5MB)</p>
            </>
          )}
        </div>
      )}

      {/* Input File (escondido) */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.bmp,image/jpeg,image/png,image/bmp"
        onChange={handleFileSelect}
        style={styles.fileInput}
      />

      {/* Informações */}
      <div style={styles.info}>
        <p style={styles.infoText}>
          💡 Dica: Use imagens de alta qualidade para melhor visualização
        </p>
        <p style={styles.infoText}>
          📏 Tamanho recomendado: 800x600 pixels ou maior
        </p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
  },

  label: {
    display: 'block',
    fontSize: '0.95rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#374151',
  },

  uploadArea: {
    width: '100%',
    height: '300px',
    border: '3px dashed #D1D5DB',
    borderRadius: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backgroundColor: '#F9FAFB',
    transition: 'all 150ms',
  },

  uploadIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },

  uploadText: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: '#374151',
    margin: '0.5rem 0',
  },

  uploadHint: {
    fontSize: '0.875rem',
    color: '#6B7280',
    margin: 0,
  },

  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },

  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #E5E7EB',
    borderTop: '4px solid #E11D48',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  previewContainer: {
    position: 'relative',
    width: '100%',
    height: '300px',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    border: '2px solid #E5E7EB',
  },

  previewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '1rem',
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
  },

  changeButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3B82F6',
    color: '#FFF',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.95rem',
  },

  removeButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#EF4444',
    color: '#FFF',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.95rem',
  },

  fileInput: {
    display: 'none',
  },

  info: {
    marginTop: '1rem',
    padding: '0.75rem',
    backgroundColor: '#EFF6FF',
    borderRadius: '0.5rem',
    border: '1px solid #DBEAFE',
  },

  infoText: {
    fontSize: '0.875rem',
    color: '#1E40AF',
    margin: '0.25rem 0',
  },
}

// Adicionar animação de spinner
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    [style*="uploadArea"]:hover {
      border-color: #E11D48 !important;
      background-color: #FEE2E2 !important;
    }
  `
  document.head.appendChild(style)
}

export default ImageUploader
