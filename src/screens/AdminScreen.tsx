// src/screens/AdminScreen.tsx
// VERSÃO LIMPA - SEM ABA SENHA (para garantir build)

import React, { useState, useRef } from 'react'
import { useConfig } from '../context/ConfigContext'
import { useOrder } from '../context/OrderContext'

interface AdminScreenProps {
  onClose: () => void
}

type AdminTab = 'geral' | 'carrossel' | 'aparencia' | 'pagamentos' | 'estatisticas'

const AdminScreen: React.FC<AdminScreenProps> = ({ onClose }) => {
  const { config, updateConfig } = useConfig()
  const { stats } = useOrder()
  const [activeTab, setActiveTab] = useState<AdminTab>('geral')

  // Estados Geral
  const [storeName, setStoreName] = useState(config.storeName)
  const [tagline, setTagline] = useState(config.tagline)
  const [buttonText, setButtonText] = useState(config.buttonText)
  const [logoPreview, setLogoPreview] = useState(config.logoUrl || '')
  const logoInputRef = useRef<HTMLInputElement>(null)

  // Estados Carrossel
  const [carouselImages, setCarouselImages] = useState(
    config.carouselSlides?.length > 0
      ? config.carouselSlides.map((s, i) => ({ ...s, localId: i }))
      : [{ localId: 0, id: '1', imageUrl: '', title: '', subtitle: '' }]
  )

  // Estados Aparência
  const [backgroundColor, setBackgroundColor] = useState(config.backgroundColor)
  const [primaryColor, setPrimaryColor] = useState(config.primaryColor)
  const [buttonTextColor, setButtonTextColor] = useState(config.buttonTextColor)
  const [textColor, setTextColor] = useState(config.textColor || '#111827')
  const [secondaryTextColor, setSecondaryTextColor] = useState(config.secondaryTextColor || '#6B7280')

  // Estados Pagamentos
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 'debit', name: 'Débito', icon: '💳', enabled: config.enabledPaymentMethods.includes('debit') },
    { id: 'credit', name: 'Crédito', icon: '💳', enabled: config.enabledPaymentMethods.includes('credit') },
    { id: 'pix', name: 'PIX', icon: '📱', enabled: config.enabledPaymentMethods.includes('pix') },
    { id: 'cash', name: 'Dinheiro', icon: '💵', enabled: config.enabledPaymentMethods.includes('cash') },
    { id: 'meal-voucher', name: 'Vale Alimentação', icon: '🍱', enabled: config.enabledPaymentMethods.includes('meal-voucher') },
    { id: 'food-voucher', name: 'Vale Refeição', icon: '🍽️', enabled: config.enabledPaymentMethods.includes('food-voucher') },
  ])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setLogoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleCarouselUpload = (localId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCarouselImages(prev =>
          prev.map(img =>
            img.localId === localId ? { ...img, imageUrl: reader.result as string } : img
          )
        )
      }
      reader.readAsDataURL(file)
    }
  }

  const saveGeral = () => {
    updateConfig({ storeName, tagline, buttonText, logoUrl: logoPreview || null })
    alert('✅ Configurações gerais salvas!')
  }

  const saveCarrossel = () => {
    const slides = carouselImages
      .filter(img => img.imageUrl)
      .map(img => ({
        id: img.id,
        imageUrl: img.imageUrl,
        title: img.title || '',
        subtitle: img.subtitle || '',
      }))
    updateConfig({ carouselSlides: slides })
    alert(`✅ ${slides.length} slides salvos!`)
  }

  const saveAppearance = () => {
    updateConfig({ backgroundColor, primaryColor, buttonTextColor, textColor, secondaryTextColor })
    alert('✅ Cores salvas!')
  }

  const savePayments = () => {
    const enabled = paymentMethods.filter(p => p.enabled).map(p => p.id)
    updateConfig({ enabledPaymentMethods: enabled })
    alert('✅ Formas de pagamento salvas!')
  }

  const tabs = [
    { id: 'geral' as AdminTab, label: 'Geral', icon: '⚙️' },
    { id: 'carrossel' as AdminTab, label: 'Carrossel', icon: '🎬' },
    { id: 'aparencia' as AdminTab, label: 'Aparência', icon: '🎨' },
    { id: 'pagamentos' as AdminTab, label: 'Pagamentos', icon: '💳' },
    { id: 'estatisticas' as AdminTab, label: 'Estatísticas', icon: '📊' },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'geral':
        return (
          <div style={styles.scrollableContent}>
            <h2 style={styles.title}>Configurações Gerais</h2>
            <label style={styles.label}>Nome da Loja</label>
            <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} style={styles.input} />
            <label style={styles.label}>Slogan/Tagline</label>
            <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} style={styles.input} placeholder="Hambúrgueres artesanais" />
            <label style={styles.label}>Texto do Botão</label>
            <input type="text" value={buttonText} onChange={(e) => setButtonText(e.target.value)} style={styles.input} />
            <label style={styles.label}>Logo (JPG/PNG)</label>
            <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} style={styles.fileInput} />
            <button style={styles.uploadBtn} onClick={() => logoInputRef.current?.click()}>📁 Escolher Logo</button>
            {logoPreview && <img src={logoPreview} alt="Logo" style={styles.preview} />}
            <button style={styles.saveBtn} onClick={saveGeral}>💾 SALVAR GERAL</button>
          </div>
        )

      case 'carrossel':
        return (
          <div style={styles.scrollableContent}>
            <h2 style={styles.title}>Carrossel</h2>
            <div style={styles.alert}>
              <p style={styles.alertText}>📐 <strong>TAMANHO IDEAL: 3189 x 2800 pixels</strong><br />✅ Use exatamente este tamanho</p>
            </div>
            {carouselImages.map((img, i) => (
              <div key={img.localId} style={styles.slideBox}>
                <h3 style={styles.slideTitle}>Slide #{i + 1}</h3>
                <input type="file" accept="image/*" id={`slide-${i}`} onChange={(e) => handleCarouselUpload(img.localId, e)} style={styles.fileInput} />
                <button style={styles.uploadBtn} onClick={() => document.getElementById(`slide-${i}`)?.click()}>📷 Escolher Imagem</button>
                {img.imageUrl && <img src={img.imageUrl} alt={`Slide ${i + 1}`} style={styles.slidePreview} />}
                <input type="text" placeholder="Título" value={img.title || ''} onChange={(e) => setCarouselImages(prev => prev.map(item => item.localId === img.localId ? { ...item, title: e.target.value } : item))} style={styles.input} />
                <input type="text" placeholder="Subtítulo" value={img.subtitle || ''} onChange={(e) => setCarouselImages(prev => prev.map(item => item.localId === img.localId ? { ...item, subtitle: e.target.value } : item))} style={styles.input} />
                {carouselImages.length > 1 && <button style={styles.removeBtn} onClick={() => setCarouselImages(prev => prev.filter(x => x.localId !== img.localId))}>🗑️ Remover</button>}
              </div>
            ))}
            <button style={styles.addBtn} onClick={() => { const newId = Math.max(...carouselImages.map(x => x.localId)) + 1; setCarouselImages([...carouselImages, { localId: newId, id: String(newId), imageUrl: '', title: '', subtitle: '' }]); }}>➕ Adicionar Slide</button>
            <button style={styles.saveBtn} onClick={saveCarrossel}>💾 SALVAR CARROSSEL</button>
          </div>
        )

      case 'aparencia':
        return (
          <div style={styles.scrollableContent}>
            <h2 style={styles.title}>Aparência</h2>
            {[
              { label: 'Cor de Fundo', value: backgroundColor, setter: setBackgroundColor },
              { label: 'Cor Primária (Botões)', value: primaryColor, setter: setPrimaryColor },
              { label: 'Cor do Texto do Botão', value: buttonTextColor, setter: setButtonTextColor },
              { label: 'Cor do Texto Principal', value: textColor, setter: setTextColor },
              { label: 'Cor do Texto Secundário', value: secondaryTextColor, setter: setSecondaryTextColor },
            ].map((color, i) => (
              <div key={i} style={{ marginBottom: '2rem' }}>
                <label style={styles.label}>{color.label}</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input type="color" value={color.value} onChange={(e) => color.setter(e.target.value)} style={styles.colorPicker} />
                  <input type="text" value={color.value} onChange={(e) => color.setter(e.target.value)} style={{ ...styles.input, flex: 1 }} />
                </div>
                <div style={{ ...styles.colorPreview, backgroundColor: color.value }} />
              </div>
            ))}
            <button style={styles.saveBtn} onClick={saveAppearance}>💾 SALVAR CORES</button>
          </div>
        )

      case 'pagamentos':
        return (
          <div style={styles.scrollableContent}>
            <h2 style={styles.title}>Formas de Pagamento</h2>
            {paymentMethods.map((method) => (
              <div key={method.id} style={styles.paymentRow}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>{method.icon}</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{method.name}</span>
                </div>
                <label style={styles.switch}>
                  <input type="checkbox" checked={method.enabled} onChange={() => setPaymentMethods(prev => prev.map(m => m.id === method.id ? { ...m, enabled: !m.enabled } : m))} style={styles.switchInput} />
                  <span style={{ ...styles.slider, backgroundColor: method.enabled ? '#10B981' : '#D1D5DB' }} />
                </label>
              </div>
            ))}
            <button style={styles.saveBtn} onClick={savePayments}>💾 SALVAR PAGAMENTOS</button>
          </div>
        )

      case 'estatisticas':
        return (
          <div style={styles.scrollableContent}>
            <h2 style={styles.title}>Estatísticas em Tempo Real</h2>
            <div style={styles.statsGrid}>
              {[
                { icon: '📊', label: 'Pedidos Hoje', value: stats.pedidosHoje },
                { icon: '💰', label: 'Faturamento Hoje', value: `R$ ${stats.totalHoje.toFixed(2)}` },
                { icon: '📅', label: 'Pedidos Semana', value: stats.pedidosSemana },
                { icon: '💵', label: 'Faturamento Semana', value: `R$ ${stats.totalSemana.toFixed(2)}` },
                { icon: '📆', label: 'Pedidos Mês', value: stats.pedidosMes },
                { icon: '💸', label: 'Faturamento Mês', value: `R$ ${stats.totalMes.toFixed(2)}` },
                { icon: '🍔', label: 'Mais Vendido', value: stats.produtoMaisVendido },
                { icon: '🎯', label: 'Ticket Médio', value: `R$ ${stats.ticketMedio.toFixed(2)}` },
              ].map((stat, i) => (
                <div key={i} style={styles.statCard}>
                  <div style={{ fontSize: '3rem' }}>{stat.icon}</div>
                  <div><p style={styles.statLabel}>{stat.label}</p><p style={styles.statValue}>{stat.value}</p></div>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>⚙️ Painel Admin</h1>
        <button style={styles.closeBtn} onClick={onClose}>✕ Fechar</button>
      </div>
      <div style={styles.layout}>
        <div style={styles.sidebar}>
          {tabs.map((tab) => (
            <button key={tab.id} style={{ ...styles.tabBtn, backgroundColor: activeTab === tab.id ? '#E11D48' : 'transparent', color: activeTab === tab.id ? '#FFFFFF' : '#374151' }} onClick={() => setActiveTab(tab.id)}>
              <span style={{ fontSize: '1.5rem' }}>{tab.icon}</span><span>{tab.label}</span>
            </button>
          ))}
        </div>
        <div style={styles.content}>{renderContent()}</div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { width: '100%', height: '100vh', backgroundColor: '#F9FAFB', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB', flexShrink: 0 },
  closeBtn: { padding: '0.75rem 1.5rem', fontSize: '1.125rem', fontWeight: 600, backgroundColor: '#F3F4F6', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' },
  layout: { display: 'flex', flex: 1, overflow: 'hidden' },
  sidebar: { width: '280px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E5E7EB', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto', flexShrink: 0 },
  tabBtn: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', fontSize: '1rem', fontWeight: 500, border: 'none', borderRadius: '0.5rem', cursor: 'pointer', textAlign: 'left', transition: 'all 150ms' },
  content: { flex: 1, overflow: 'hidden', backgroundColor: '#F9FAFB' },
  scrollableContent: { height: '100%', overflowY: 'auto', padding: '2rem', maxWidth: '900px' },
  title: { fontSize: '1.875rem', fontWeight: 700, marginBottom: '2rem', color: '#111827' },
  label: { display: 'block', fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', marginTop: '1rem', color: '#374151' },
  input: { width: '100%', padding: '0.75rem', fontSize: '1rem', border: '2px solid #D1D5DB', borderRadius: '0.5rem', marginBottom: '1rem' },
  fileInput: { display: 'none' },
  uploadBtn: { padding: '0.75rem 1.5rem', fontSize: '1rem', fontWeight: 600, backgroundColor: '#E11D48', color: '#FFFFFF', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', marginBottom: '1rem' },
  preview: { maxWidth: '200px', maxHeight: '200px', objectFit: 'contain', marginTop: '1rem', marginBottom: '1rem', border: '2px solid #E5E7EB', borderRadius: '0.5rem' },
  alert: { padding: '1.5rem', backgroundColor: '#DBEAFE', border: '2px solid #3B82F6', borderRadius: '0.75rem', marginBottom: '2rem' },
  alertText: { fontSize: '1rem', color: '#1E40AF', margin: 0, lineHeight: 1.6 },
  slideBox: { padding: '1.5rem', backgroundColor: '#FFFFFF', border: '2px solid #E5E7EB', borderRadius: '0.75rem', marginBottom: '1.5rem' },
  slideTitle: { fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' },
  slidePreview: { width: '100%', maxHeight: '300px', objectFit: 'contain', backgroundColor: '#000000', borderRadius: '0.5rem', marginTop: '1rem', marginBottom: '1rem' },
  removeBtn: { padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 600, backgroundColor: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', marginTop: '1rem' },
  addBtn: { width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 700, backgroundColor: '#10B981', color: '#FFFFFF', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', marginBottom: '1rem' },
  saveBtn: { width: '100%', padding: '1rem 2rem', fontSize: '1.125rem', fontWeight: 700, backgroundColor: '#E11D48', color: '#FFFFFF', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', marginTop: '2rem' },
  colorPicker: { width: '80px', height: '48px', border: '2px solid #D1D5DB', borderRadius: '0.5rem', cursor: 'pointer' },
  colorPreview: { width: '100%', height: '60px', borderRadius: '0.5rem', marginTop: '0.75rem', border: '2px solid #D1D5DB' },
  paymentRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', backgroundColor: '#FFFFFF', border: '2px solid #E5E7EB', borderRadius: '0.75rem', marginBottom: '1rem' },
  switch: { position: 'relative', display: 'inline-block', width: '60px', height: '34px' },
  switchInput: { opacity: 0, width: 0, height: 0 },
  slider: { position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '34px', transition: 'all 300ms ease-in-out' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' },
  statCard: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', backgroundColor: '#FFFFFF', border: '2px solid #E5E7EB', borderRadius: '0.75rem' },
  statLabel: { fontSize: '0.875rem', color: '#6B7280', margin: 0, marginBottom: '0.25rem' },
  statValue: { fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#111827' },
}

export default AdminScreen
