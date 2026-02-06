// src/screens/SuccessScreen.tsx

import React, { useEffect } from 'react';
import { theme } from '../theme/theme';

interface SuccessScreenProps {
  orderId: string;
  onFinish: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ orderId, onFinish }) => {
  // Auto-redirecionar após 10 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div style={styles.container}>
      {/* Ícone de sucesso */}
      <div style={styles.iconWrapper}>
        <div style={styles.checkIcon}>✓</div>
      </div>

      {/* Mensagem principal */}
      <h1 style={styles.title}>Pedido Confirmado!</h1>
      
      {/* Número do pedido */}
      <div style={styles.orderBox}>
        <p style={styles.orderLabel}>Número do pedido</p>
        <p style={styles.orderNumber}>#{orderId}</p>
      </div>

      {/* Instruções */}
      <div style={styles.instructions}>
        <p style={styles.instructionText}>
          🔔 Aguarde a chamada do seu pedido
        </p>
        <p style={styles.instructionText}>
          ⏱️ Tempo estimado: 10-15 minutos
        </p>
      </div>

      {/* Botão para fazer novo pedido */}
      <button style={styles.finishButton} onClick={onFinish}>
        FAZER NOVO PEDIDO
      </button>

      {/* Mensagem de auto-redirecionamento */}
      <p style={styles.autoRedirect}>
        Voltando para o início em 10 segundos...
      </p>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: theme.colors.background.default,
    padding: theme.spacing['3xl'],
    textAlign: 'center',
  },

  iconWrapper: {
    marginBottom: theme.spacing['2xl'],
  },

  checkIcon: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: theme.colors.success,
    color: theme.colors.neutral.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '72px',
    fontWeight: theme.typography.fontWeight.bold,
    boxShadow: theme.shadows.xl,
    animation: 'scaleIn 0.5s ease-out',
  },

  title: {
    fontSize: theme.typography.fontSize['5xl'],
    fontWeight: theme.typography.fontWeight.extrabold,
    color: theme.colors.neutral.gray[900],
    marginBottom: theme.spacing.xl,
  },

  orderBox: {
    backgroundColor: theme.colors.background.paper,
    padding: theme.spacing['2xl'],
    borderRadius: theme.borderRadius.xl,
    boxShadow: theme.shadows.lg,
    marginBottom: theme.spacing['2xl'],
    minWidth: '400px',
  },

  orderLabel: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.neutral.gray[600],
    margin: 0,
    marginBottom: theme.spacing.sm,
  },

  orderNumber: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.extrabold,
    color: theme.colors.primary.main,
    margin: 0,
  },

  instructions: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
    marginBottom: theme.spacing['2xl'],
  },

  instructionText: {
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.neutral.gray[700],
    margin: 0,
  },

  finishButton: {
    padding: `${theme.spacing.xl} ${theme.spacing['3xl']}`,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    backgroundColor: theme.colors.primary.main,
    color: theme.colors.neutral.white,
    border: 'none',
    borderRadius: theme.borderRadius.lg,
    cursor: 'pointer',
    boxShadow: theme.shadows.lg,
    transition: `all ${theme.transitions.fast}`,
    marginBottom: theme.spacing.lg,
  },

  autoRedirect: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.gray[500],
    margin: 0,
  },
};

export default SuccessScreen;
