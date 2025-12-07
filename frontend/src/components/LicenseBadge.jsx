import React from 'react';

const LICENSE_INFO = {
  'CC0': {
    label: 'CC0',
    description: 'Domínio Público',
    color: '#059669',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/'
  },
  'CC BY': {
    label: 'CC BY',
    description: 'Atribuição',
    color: '#0891B2',
    url: 'https://creativecommons.org/licenses/by/4.0/'
  },
  'CC BY-SA': {
    label: 'CC BY-SA',
    description: 'Atribuição-CompartilhaIgual',
    color: '#0891B2',
    url: 'https://creativecommons.org/licenses/by-sa/4.0/'
  },
  'CC BY-ND': {
    label: 'CC BY-ND',
    description: 'Atribuição-SemDerivações',
    color: '#0891B2',
    url: 'https://creativecommons.org/licenses/by-nd/4.0/'
  },
  'CC BY-NC': {
    label: 'CC BY-NC',
    description: 'Atribuição-NãoComercial',
    color: '#DC2626',
    url: 'https://creativecommons.org/licenses/by-nc/4.0/'
  },
  'CC BY-NC-SA': {
    label: 'CC BY-NC-SA',
    description: 'Atribuição-NãoComercial-CompartilhaIgual',
    color: '#DC2626',
    url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
  },
  'CC BY-NC-ND': {
    label: 'CC BY-NC-ND',
    description: 'Atribuição-NãoComercial-SemDerivações',
    color: '#DC2626',
    url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/'
  },
  'free': {
    label: 'Gratuito',
    description: 'Uso gratuito',
    color: '#059669',
    url: null
  },
  'paid': {
    label: 'Pago',
    description: 'Requer licença',
    color: '#D97706',
    url: null
  }
};

export const LicenseBadge = ({ license, size = 'sm', showDescription = false }) => {
  const licenseKey = Object.keys(LICENSE_INFO).find(key => 
    license?.toUpperCase().includes(key) || license === key.toLowerCase()
  );
  
  const info = LICENSE_INFO[licenseKey] || LICENSE_INFO['free'];
  
  const sizeClasses = {
    xs: 'text-xs px-2 py-0.5',
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5'
  };

  const badge = (
    <span 
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]}`}
      style={{ 
        backgroundColor: `${info.color}15`,
        color: info.color,
        border: `1px solid ${info.color}30`
      }}
      title={info.description}
    >
      {info.label}
      {showDescription && <span className="text-xs opacity-75">· {info.description}</span>}
    </span>
  );

  if (info.url) {
    return (
      <a 
        href={info.url} 
        target=\"_blank\" 
        rel=\"noopener noreferrer\"
        className=\"inline-block hover:opacity-80 transition-opacity\"
        onClick={(e) => e.stopPropagation()}
      >
        {badge}
      </a>
    );
  }

  return badge;
};

export default LicenseBadge;
