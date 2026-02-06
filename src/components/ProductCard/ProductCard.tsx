// src/components/ProductCard/ProductCard.tsx

import React from 'react'
import { theme } from '../../theme/theme'

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  imageUrl: string
  category?: string
  available?: boolean
}

interface ProductCardProps {
  product: Product
  onAdd: (product: Product) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  const [isPressed, setIsPressed] = React.useState(false)

  const handleClick = () => {
    if (!product.available) return
    onAdd(product)
  }

  return (
    <div
      style={{
        ...styles.card,
        opacity: product.available === false ? 0.5 : 1,
        transform: isPressed ? 'scale(0.98)' : 'scale(1)',
        cursor: product.available === false ? 'not-allowed' : 'pointer',
      }}
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      {/* Imagem do produto */}
      <div style={styles.imageWrapper}>
        <img
          src={product.imageUrl}
          alt={product.name}
          style={styles.image}
        />
        
        {/* Badge de indisponível */}
        {product.available === false && (
          <div style={styles.unavailableBadge}>
            <span style={styles.unavailableText}>Indisponível</span>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div style={styles.content}>
        {/* Nome do produto */}
        <h3 style={styles.name}>{product.name}</h3>

        {/* Descrição (opcional) */}
        {product.description && (
          <p style={styles.description}>{product.description}</p>
        )}

        {/* Preço e botão de adicionar */}
        <div style={styles.footer}>
          <span style={styles.price}>
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          
          <button
            style={{
              ...styles.addButton,
              backgroundColor: product.available === false
                ? theme.colors.neutral.gray[400]
                : theme.colors.primary.main,
            }}
            disabled={product.available === false}
          >
            <span style={styles.plusIcon}>+</span>
          </button>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    width: '280px',
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    boxShadow: theme.shadows.md,
    transition: `all ${theme.transitions.fast}`,
    userSelect: 'none',
  },

  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: '200px',
    backgroundColor: theme.colors.neutral.gray[100],
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    userSelect: 'none',
    pointerEvents: 'none',
  },

  unavailableBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.md,
  },

  unavailableText: {
    color: theme.colors.neutral.white,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },

  content: {
    padding: theme.spacing.lg,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm,
  },

  name: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral.gray[900],
    lineHeight: theme.typography.lineHeight.tight,
    margin: 0,
  },

  description: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.gray[600],
    lineHeight: theme.typography.lineHeight.normal,
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },

  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },

  price: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.extrabold,
    color: theme.colors.primary.main,
  },

  addButton: {
    width: '48px',
    height: '48px',
    borderRadius: theme.borderRadius.full,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: theme.shadows.md,
    transition: `all ${theme.transitions.fast}`,
  },

  plusIcon: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral.white,
    lineHeight: 1,
  },
}
