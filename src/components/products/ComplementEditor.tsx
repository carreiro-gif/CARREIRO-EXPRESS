// src/components/products/ComplementEditor.tsx
// Editor de complementos IGUAL À BRENDI

import React, { useState } from 'react'
import type { ProductComplement, ComplementOption, ComplementType } from '../../types/product-types'

interface ComplementEditorProps {
  complement: ProductComplement
  onChange: (complement: ProductComplement) => void
  onDelete: () => void
}

const ComplementEditor: React.FC<ComplementEditorProps> = ({
  complement,
  onChange,
  onDelete
}) => {
  const [expanded, setExpanded] = useState(true)

  const updateComplement = (updates: Partial<ProductComplement>) => {
    onChange({ ...complement, ...updates })
  }

  const addOption = () => {
    const newOption: ComplementOption = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      integration_code: '',
      status: 'active',
      order: complement.options.length
    }
    updateComplement({ options: [...complement.options, newOption] })
  }

  const updateOption = (optionId: string, updates: Partial<ComplementOption>) => {
    const updated = complement.options.map(opt =>
      opt.id === optionId ? { ...opt, ...updates } : opt
    )
    updateComplement({ options: updated })
  }

  const deleteOption = (optionId: string) => {
    updateComplement({
      options: complement.options.filter(opt => opt.id !== optionId)
    })
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => setExpanded(!expanded)} style={styles.expandBtn}>
          {expanded ? '▼' : '▶'}
        </button>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            value={complement.name}
            onChange={(e) => updateComplement({ name: e.target.value })}
            placeholder="Título da variação"
            style={styles.titleInput}
          />
        </div>
        <button onClick={onDelete} style={styles.deleteBtn}>
          🗑️
        </button>
      </div>

      {expanded && (
        <div style={styles.content}>
          {/* Tipo de Opção */}
          <div style={styles.typeSelector}>
            <label style={styles.typeOption}>
              <input
                type="radio"
                checked={complement.type === 'single'}
                onChange={() => updateComplement({ type: 'single' })}
              />
              <div style={styles.typeCard}>
                <div style={styles.typeIcon}>●</div>
                <span>Opção única</span>
              </div>
            </label>

            <label style={styles.typeOption}>
              <input
                type="radio"
                checked={complement.type === 'multiple'}
                onChange={() => updateComplement({ type: 'multiple' })}
              />
              <div style={styles.typeCard}>
                <div style={styles.typeIcon}>☑</div>
                <span>Opção múltipla</span>
              </div>
            </label>

            <label style={styles.typeOption}>
              <input
                type="radio"
                checked={complement.type === 'addable'}
                onChange={() => updateComplement({ type: 'addable' })}
              />
              <div style={styles.typeCard}>
                <div style={styles.typeIcon}>±</div>
                <span>Opção somável</span>
              </div>
            </label>
          </div>

          {/* Quantidade para escolha */}
          <div style={styles.quantityRow}>
            <span>O cliente escolherá de</span>
            <input
              type="number"
              value={complement.min_quantity}
              onChange={(e) => updateComplement({ min_quantity: parseInt(e.target.value) || 0 })}
              min="0"
              style={styles.quantityInput}
            />
            <span>até</span>
            <input
              type="number"
              value={complement.max_quantity}
              onChange={(e) => updateComplement({ max_quantity: parseInt(e.target.value) || 0 })}
              min="0"
              style={styles.quantityInput}
            />
            <span>unidades</span>
          </div>

          {/* Status */}
          <div style={styles.statusRow}>
            <label style={complement.status === 'active' ? styles.statusActive : styles.statusBtn}>
              <input
                type="radio"
                checked={complement.status === 'active'}
                onChange={() => updateComplement({ status: 'active' })}
              />
              Ativo
            </label>
            <label style={complement.status === 'inactive' ? styles.statusActive : styles.statusBtn}>
              <input
                type="radio"
                checked={complement.status === 'inactive'}
                onChange={() => updateComplement({ status: 'inactive' })}
              />
              Inativo
            </label>
            <label style={complement.status === 'unavailable' ? styles.statusActive : styles.statusBtn}>
              <input
                type="radio"
                checked={complement.status === 'unavailable'}
                onChange={() => updateComplement({ status: 'unavailable' })}
              />
              Em falta
            </label>
          </div>

          {/* Opções */}
          <div style={styles.optionsSection}>
            <h4 style={styles.optionsTitle}>Opções</h4>
            {complement.options.map((option) => (
              <div key={option.id} style={styles.optionRow}>
                <span style={styles.dragHandle}>⋮⋮</span>
                
                <input
                  type="text"
                  value={option.name}
                  onChange={(e) => updateOption(option.id, { name: e.target.value })}
                  placeholder="Nome da opção"
                  style={styles.optionInput}
                />

                <input
                  type="number"
                  value={option.price}
                  onChange={(e) => updateOption(option.id, { price: parseFloat(e.target.value) || 0 })}
                  placeholder="0,00"
                  step="0.01"
                  style={styles.priceInput}
                />

                <input
                  type="text"
                  value={option.integration_code}
                  onChange={(e) => updateOption(option.id, { integration_code: e.target.value })}
                  placeholder="Código PDV"
                  style={styles.codeInput}
                />

                <select
                  value={option.status}
                  onChange={(e) => updateOption(option.id, { status: e.target.value as any })}
                  style={styles.statusSelect}
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                  <option value="unavailable">Em falta</option>
                </select>

                <button onClick={() => deleteOption(option.id)} style={styles.deleteOptionBtn}>
                  🗑️
                </button>

                <button style={styles.expandOptionBtn}>▼</button>
              </div>
            ))}

            <button onClick={addOption} style={styles.addOptionBtn}>
              + Adicionar opção
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: '#FFF',
    border: '2px solid #E5E7EB',
    borderRadius: '0.75rem',
    marginBottom: '1rem',
    overflow: 'hidden',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#F9FAFB',
    borderBottom: '1px solid #E5E7EB',
  },

  expandBtn: {
    width: '32px',
    height: '32px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '1rem',
  },

  titleInput: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    fontWeight: 600,
    border: '1px solid #D1D5DB',
    borderRadius: '0.375rem',
  },

  deleteBtn: {
    padding: '0.5rem',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '1.25rem',
  },

  content: {
    padding: '1.5rem',
  },

  typeSelector: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem',
  },

  typeOption: {
    cursor: 'pointer',
  },

  typeCard: {
    padding: '1.5rem',
    border: '2px solid #E5E7EB',
    borderRadius: '0.5rem',
    textAlign: 'center',
    transition: 'all 150ms',
  },

  typeIcon: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },

  quantityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
  },

  quantityInput: {
    width: '80px',
    padding: '0.5rem',
    border: '1px solid #D1D5DB',
    borderRadius: '0.375rem',
    textAlign: 'center',
  },

  statusRow: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },

  statusBtn: {
    padding: '0.5rem 1rem',
    border: '1px solid #D1D5DB',
    borderRadius: '9999px',
    cursor: 'pointer',
    backgroundColor: '#FFF',
  },

  statusActive: {
    padding: '0.5rem 1rem',
    border: '1px solid #E11D48',
    borderRadius: '9999px',
    cursor: 'pointer',
    backgroundColor: '#FEE2E2',
    color: '#E11D48',
  },

  optionsSection: {
    marginTop: '1.5rem',
  },

  optionsTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '1rem',
  },

  optionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.75rem',
    padding: '0.75rem',
    backgroundColor: '#F9FAFB',
    borderRadius: '0.5rem',
  },

  dragHandle: {
    cursor: 'grab',
    color: '#9CA3AF',
  },

  optionInput: {
    flex: 2,
    padding: '0.5rem',
    border: '1px solid #D1D5DB',
    borderRadius: '0.375rem',
  },

  priceInput: {
    width: '100px',
    padding: '0.5rem',
    border: '1px solid #D1D5DB',
    borderRadius: '0.375rem',
  },

  codeInput: {
    flex: 1,
    padding: '0.5rem',
    border: '1px solid #D1D5DB',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
  },

  statusSelect: {
    padding: '0.5rem',
    border: '1px solid #D1D5DB',
    borderRadius: '0.375rem',
  },

  deleteOptionBtn: {
    padding: '0.25rem 0.5rem',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
  },

  expandOptionBtn: {
    padding: '0.25rem 0.5rem',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
  },

  addOptionBtn: {
    width: '100%',
    padding: '0.75rem',
    border: '2px dashed #D1D5DB',
    borderRadius: '0.5rem',
    backgroundColor: 'transparent',
    color: '#6B7280',
    cursor: 'pointer',
    fontWeight: 500,
  },
}

export default ComplementEditor
