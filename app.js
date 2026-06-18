/* ==========================================
   COMERCIALGRAM - CORE ENGINE & UI CONTROLLER
   ========================================== */

// --- 1. GLOBAL STATE & PERSISTENCE ---
const STORAGE_KEY_ICP = 'comercialgram_icp';
const STORAGE_KEY_CRM = 'comercialgram_crm';

// Default ICP optimized for an Audiovisual Production Company targeting high-ticket clients
const DEFAULT_ICP = {
    niche: 'clinicas_estetica_medicos',
    minFollowers: 2000,
    maxFollowers: 100000,
    opportunites: {
        badAudio: true,
        badLighting: true,
        badEditing: true,
        noReels: true
    },
    keywords: 'Clínica, Dr, Dra, Cirurgião, Plástica, Harmonização, Estética, Curso, Botox, Silicone, Lipo, Barra, Ipanema, Leblon',
    redFlags: 'pessoal, privada, fechado, hobbie, desativado, memes',
    tone: 'bold'
};

// Application State
let appState = {
    icp: { ...DEFAULT_ICP },
    leads: [], // CRM Leads
    currentLeadInAnalysis: null,
    currentMsgVariation: 1
};

// Pre-configured simulation database of Instagram leads (Real-world style)
const SIMULATED_CATALOG = [
    {
        username: 'dr.kleber.plastica',
        fullname: 'Dr. Kleber Vasques | Cirurgião Plástico',
        followers: 45200,
        niche: 'clinicas_estetica_medicos',
        bio: '🏥 Cirurgia Plástica Estética e Reparadora | Membro SBCP\n✨ Especialista em Lipo HD e Prótese de Recuperação Rápida\n📍 Clínica na Barra da Tijuca - RJ\nConsultas e agendamentos pelo link 👇',
        lightingOpportunity: true,
        audioOpportunity: false,
        editingOpportunity: true,
        reelsOpportunity: true
    },
    {
        username: 'dra.mariana.harmonizacao',
        fullname: 'Dra. Mariana M. | Harmonização Facial & Corporal',
        followers: 18500,
        niche: 'clinicas_estetica_medicos',
        bio: '💉 Especialista em Rejuvenescimento e Harmonização Facial\n🌟 Dra. Mariana M. - CRO/RJ 45982\n📍 Consultório em Ipanema, Rio de Janeiro\n📆 Agende sua avaliação no link abaixo 👇',
        lightingOpportunity: true,
        audioOpportunity: true,
        editingOpportunity: true,
        reelsOpportunity: false
    },
    {
        username: 'rebeca.estetica.academy',
        fullname: 'Rebeca Melo | Estética & Cursos',
        followers: 32400,
        niche: 'infoprodutores_cursos',
        bio: '✨ Ensino o caminho para faturar 5 dígitos com Micropigmentação Labial\n🎓 Criadora do Método Lips Perfect\n📍 Studio de Estética na Barra da Tijuca - RJ\n👇 Gravei meu curso online, mas o áudio e a iluminação ficaram muito amadores! Meus segredos aqui',
        lightingOpportunity: true,
        audioOpportunity: true,
        editingOpportunity: true,
        reelsOpportunity: true
    },
    {
        username: 'gustavo.luxo.rj',
        fullname: 'Gustavo Rezende | Imóveis de Luxo Barra & Zona Sul',
        followers: 24300,
        niche: 'imoveis_luxo_rio',
        bio: '🔑 Corretor de Imóveis de Altíssimo Padrão no Rio de Janeiro\n🏝️ Coberturas e Mansões na Barra, Recreio, Ipanema e Leblon\n🏠 Encontre o lar dos seus sonhos\nFale comigo diretamente no WhatsApp 👇',
        lightingOpportunity: true,
        audioOpportunity: false,
        editingOpportunity: true,
        reelsOpportunity: true
    },
    {
        username: 'patricia.hipnose.clinica',
        fullname: 'Patrícia Lins | Hipnoterapeuta Clínica',
        followers: 6800,
        niche: 'hipnoterapeutas_terapeutas',
        bio: '🧠 Supere a ansiedade, traumas e insônia em poucas sessões\n🌀 Tratamento rápido baseado em Hipnoterapia Avançada\n📍 Atendimentos Online e Presencial na Barra\nAgende seu diagnóstico 👇',
        lightingOpportunity: false,
        audioOpportunity: true,
        editingOpportunity: true,
        reelsOpportunity: true
    },
    {
        username: 'rodrigo.consorcio.prime',
        fullname: 'Rodrigo Ramos | Consórcios & Alta Renda',
        followers: 12400,
        niche: 'consorcio_vendas_alta_renda',
        bio: '📊 Planejamento financeiro inteligente para conquista de patrimônio\n💰 Especialista em consórcios de alta renda (Imóveis e Automóveis)\n🚀 Multiplique seu capital sem juros abusivos\nSimule agora gratuitamente 👇',
        lightingOpportunity: true,
        audioOpportunity: true,
        editingOpportunity: false,
        reelsOpportunity: true
    },
    {
        username: 'adv.thiagocastro',
        fullname: 'Thiago Castro | Advogado Societário',
        followers: 5100,
        niche: 'profissionais_liberais',
        bio: '⚖️ Segurança jurídica para startups e empresas em expansão\nCEO Castro Associados - Rio de Janeiro\nFale diretamente comigo 👇',
        lightingOpportunity: true,
        audioOpportunity: true,
        editingOpportunity: true,
        reelsOpportunity: true
    },
    {
        username: 'ana.silva98',
        fullname: 'Ana Clara Silva',
        followers: 432,
        niche: 'profissionais_liberais',
        bio: 'Estudante de Nutrição 🍎 | Apaixonada por viagens e livros ✈️📚\nConta privada! Só amigos',
        lightingOpportunity: false,
        audioOpportunity: false,
        editingOpportunity: false,
        reelsOpportunity: false
    }
];

// Load settings from storage
function loadFromStorage() {
    const storedIcp = localStorage.getItem(STORAGE_KEY_ICP);
    if (storedIcp) {
        appState.icp = JSON.parse(storedIcp);
    }
    
    const storedCrm = localStorage.getItem(STORAGE_KEY_CRM);
    if (storedCrm) {
        appState.leads = JSON.parse(storedCrm);
    } else {
        // Pre-populate with a demo lead in the CRM so it doesn't look empty
        appState.leads = [
            {
                id: 'lead_demo_1',
                username: 'dra.leticia.plastica',
                fullname: 'Dra. Letícia Lins | Cirurgiã Plástica',
                followers: 28400,
                niche: 'clinicas_estetica_medicos',
                bio: '🏥 Cirurgia Plástica & Bem Estar | SBCP\n✨ Especialista em Mamoplastia e Lipo HD\n📍 Consultório em Ipanema, Rio de Janeiro\nAgende sua avaliação pelo WhatsApp abaixo 👇',
                score: 92,
                status: 'qualificado',
                nicheLabel: 'Clínicas de Estética & Médicos/Cirurgiões',
                justification: 'Lead extremamente qualificado. Possui alta intenção comercial baseada na palavra-chave \'Cirurgiã Plástica\' e serviços de alto valor agregado em Ipanema. Vídeos recentes apresentam iluminação amadora (fluorescente de teto) e eco no áudio. Uma iluminação cinematográfica de estúdio aumentaria drasticamente a percepção de sofisticação clínica e autoridade, facilitando o agendamento de consultas de alto ticket.',
                lightingOpportunity: true,
                audioOpportunity: true,
                editingOpportunity: true,
                reelsOpportunity: false,
                dateAdded: new Date().toLocaleDateString('pt-BR')
            }
        ];
        saveCrmToStorage();
    }
}

function saveIcpToStorage() {
    localStorage.setItem(STORAGE_KEY_ICP, JSON.stringify(appState.icp));
}

function saveCrmToStorage() {
    localStorage.setItem(STORAGE_KEY_CRM, JSON.stringify(appState.leads));
}


// --- 2. LEAD QUALIFICATION LOGIC ---
function runLeadQualification(leadData) {
    let score = 0;
    const icp = appState.icp;
    
    // a. Niche Match (Max 35 points)
    let nichePoints = 0;
    if (leadData.niche === icp.niche) {
        nichePoints = 35;
    } else {
        // Related high-ticket niches get partial points
        const highTicketNiches = ['clinicas_estetica_medicos', 'infoprodutores_cursos', 'imoveis_luxo_rio', 'hipnoterapeutas_terapeutas', 'consorcio_vendas_alta_renda', 'profissionais_liberais'];
        if (highTicketNiches.includes(leadData.niche)) {
            nichePoints = 22;
        } else {
            nichePoints = 10;
        }
    }
    score += nichePoints;

    // b. Followers Range (Max 15 points)
    let followerPoints = 0;
    const fCount = parseInt(leadData.followers) || 0;
    if (fCount >= icp.minFollowers && fCount <= icp.maxFollowers) {
        followerPoints = 15;
    } else if (fCount > 0 && fCount >= (icp.minFollowers * 0.5) && fCount <= (icp.maxFollowers * 1.5)) {
        followerPoints = 8; // Close enough
    } else {
        followerPoints = 3;
    }
    score += followerPoints;

    // c. Bio Keywords & Redflags Analysis (Max 30 points)
    let keywordPoints = 0;
    const bioText = (leadData.bio || '').toLowerCase();
    
    // Check Redflags first
    const redFlagsList = icp.redFlags.split(',').map(k => k.trim().toLowerCase()).filter(k => k.length > 0);
    let hasRedflags = false;
    let matchedRedflags = [];
    
    redFlagsList.forEach(flag => {
        if (flag && bioText.includes(flag)) {
            hasRedflags = true;
            matchedRedflags.push(flag);
        }
    });

    // Check Positive Keywords
    const keywordsList = icp.keywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k.length > 0);
    let matchedKeywords = [];
    
    keywordsList.forEach(keyword => {
        if (keyword && bioText.includes(keyword)) {
            matchedKeywords.push(keyword);
        }
    });

    if (hasRedflags) {
        // Redflags drastically penalize score
        score -= 50;
    } else {
        // Calculate points based on matched keywords (up to 5 keywords count)
        const matchCount = Math.min(matchedKeywords.length, 5);
        keywordPoints = matchCount * 6; // Max 30 points
        score += keywordPoints;
    }

    // d. Content Opportunities (Max 20 points)
    // If they have content defects, it's a HIGHER opportunity for us to sell, so we ADD score!
    let opportunityPoints = 0;
    let activeOpportunities = [];

    if (leadData.lightingOpportunity && icp.opportunites.badLighting) {
        opportunityPoints += 5;
        activeOpportunities.push('Iluminação amadora/escura');
    }
    if (leadData.audioOpportunity && icp.opportunites.badAudio) {
        opportunityPoints += 5;
        activeOpportunities.push('Áudio com eco/ruído');
    }
    if (leadData.editingOpportunity && icp.opportunites.badEditing) {
        opportunityPoints += 5;
        activeOpportunities.push('Falta de cortes e legendas dinâmicas');
    }
    if (leadData.reelsOpportunity && icp.opportunites.noReels) {
        opportunityPoints += 5;
        activeOpportunities.push('Baixo uso de Reels ou Reels sem estrutura');
    }
    score += opportunityPoints;

    // Clamp score between 0 and 100
    score = Math.max(0, Math.min(100, Math.round(score)));

    // Determine Fit Status
    let status = 'Desqualificado';
    if (score >= 70 && !hasRedflags) {
        status = 'QUALIFICADO (Fit Alto)';
    } else if (score >= 50 && !hasRedflags) {
        status = 'QUALIFICADO (Fit Médio)';
    } else {
        status = 'DESQUALIFICADO (Sem Fit)';
    }

    // Map niche key to readable label
    const nicheLabels = {
        clinicas_estetica_medicos: 'Clínicas de Estética & Médicos/Cirurgiões',
        infoprodutores_cursos: 'Gravação de Cursos Online & Infoprodutos',
        imoveis_luxo_rio: 'Imóveis de Luxo (RJ)',
        hipnoterapeutas_terapeutas: 'Hipnoterapeuta',
        consorcio_vendas_alta_renda: 'Consórcios Alta Renda',
        profissionais_liberais: 'Advogado/Consultor'
    };
    const nicheLabel = nicheLabels[leadData.niche] || 'Outro';

    // Generate diagnostic justification
    let justification = '';
    if (hasRedflags) {
        justification = `Lead desqualificado comercialmente devido aos termos detectados na bio (${matchedRedflags.join(', ')}), indicando perfil estritamente pessoal, inativo ou inadequado para contratos comerciais.`;
    } else if (score < 50) {
        justification = `Lead com baixo alinhamento comercial (Score ${score}). Número de seguidores (${fCount}) ou alinhamento de nicho não atingem os critérios mínimos. Bio sem foco em vendas de alto ticket.`;
    } else {
        justification = `Lead qualificado! Detectamos forte fit comercial no nicho de ${nicheLabel}. Encontrou correspondência em termos cruciais da bio: [${matchedKeywords.slice(0, 3).join(', ')}]. \n\nDiagnóstico de Conteúdo: `;
        if (activeOpportunities.length > 0) {
            justification += `O perfil possui ótimas brechas de venda audiovisual: ${activeOpportunities.join(', ')}. Os vídeos atuais parecem amadores, gerando uma barreira na venda de tratamentos/serviços de alto ticket. A abordagem de fotos e vídeos com padrão cinematográfico trará alto impacto na autoridade visual da marca.`;
        } else {
            justification += `O perfil já publica vídeos, mas falta uma linha de roteirização direcionada a entretenimento de marca e vendas (infotenimento). Perfeito para sugerir suporte de roteiro e co-produção de Reels de conversão.`;
        }
    }

    return {
        username: leadData.username,
        fullname: leadData.fullname,
        followers: fCount,
        niche: leadData.niche,
        bio: leadData.bio,
        score: score,
        status: status,
        nicheLabel: nicheLabel,
        justification: justification,
        lightingOpportunity: leadData.lightingOpportunity,
        audioOpportunity: leadData.audioOpportunity,
        editingOpportunity: leadData.editingOpportunity,
        reelsOpportunity: leadData.reelsOpportunity
    };
}


// --- 3. PERSISTENT APPROACH (OUTREACH) GENERATOR ---
function generateOutreachMessage(lead, variationNum, tone) {
    // 1. Weakness hook in Portuguese based on active opportunities
    let weakness = '';
    if (lead.lightingOpportunity && lead.audioOpportunity) {
        weakness = 'a iluminação amadora de consultório e o áudio com eco';
    } else if (lead.lightingOpportunity) {
        weakness = 'a iluminação fluorescente comum que ofusca o profissionalismo';
    } else if (lead.audioOpportunity) {
        weakness = 'o eco e ruído de fundo no seu áudio';
    } else if (lead.editingOpportunity) {
        weakness = 'a falta de legendas dinâmicas e cortes ágeis';
    } else {
        weakness = 'a qualidade geral técnica do vídeo';
    }

    const first = lead.fullname ? lead.fullname.split(' ')[0] : 'Dr(a)';

    // Specialized copies based on lead niche
    if (lead.niche === 'clinicas_estetica_medicos') {
        switch (variationNum) {
            case 1: // BYPASS DO GATEKEEPER / PRESENTES AUDIOVISUAL (Story/Reels Editado)
                return `Olá! Tudo bem? Fiquei encantada com a clínica do(a) Dr(a). ${first} e o posicionamento de vocês nas redes. 

Sou especialista em produção audiovisual premium no Rio (Barra/Zona Sul) e, como demonstração, peguei um dos últimos vídeos do perfil de vocês e fiz uma edição profissional de presente: apliquei color grading de cinema, ajustei o ruído do áudio (${weakness}) e coloquei legendas dinâmicas premium (aquelas que prendem a atenção). Ficou surreal de elegante!

Sei que a agenda dele(a) é lotada, por isso fiz isso de forma 100% gratuita. Posso enviar o link do vídeo pronto aqui para você avaliar e mostrar para o(a) Dr(a)? Tenho certeza que ele(a) vai adorar o resultado!`;

            case 2: // ESTRATÉGIA DO GANCHO DO CONCORRENTE
                return `Olá! Tudo bem? Sou diretor de cena na nossa produtora e monitoramos as redes das maiores clínicas e cirurgiões plásticos da Zona Sul e Barra. 

Notamos que duas clínicas concorrentes aqui na região começaram a rodar um formato específico de "Minidoc de Bastidores Cinematográfico" que está explodindo em engajamento e captação de procedimentos de alto valor.

Gravei um vídeo super rápido de 45 segundos analisando o posicionamento de vocês e apontando como pequenas correções técnicas (como ajustar ${weakness}) fariam vocês superarem esse formato. Posso te enviar esse link rápido para você apresentar na próxima reunião da clínica?`;

            case 3: // ESTRATÉGIA DE PARCERIA E CO-PRODUÇÃO DE CURSO ONLINE
                return `Prezada equipe comercial / diretoria comercial, tudo bem? 

Gostaria de formalizar uma proposta de parceria estratégica de Co-produção e Gravação de Curso Online para o(a) Dr(a). ${first}. 

Nossa produtora é especializada em estruturar, dirigir e gravar infoprodutos e cursos de alto padrão para médicos e clínicas de estética (inclusive, recentemente gravamos um curso de Micropigmentação Labial completo para uma renomada clínica de estética aqui no Rio, estruturando desde as aulas até os criativos de tráfego pago). 

Oferecemos uma solução "chave na mão", gravando no próprio consultório ou no nosso estúdio móvel com câmeras de cinema, sem que o(a) Dr(a) perca tempo com a parte técnica. Com quem eu poderia falar ou para qual e-mail comercial posso enviar nosso catálogo e cases de cursos produzidos?`;
        }
    } else if (lead.niche === 'infoprodutores_cursos') {
        switch (variationNum) {
            case 1: // BYPASS DO GATEKEEPER / PRESENTES AUDIOVISUAL (Story/Reels Editado)
                return `Olá, ${first}! Tudo bem? Vi seu conteúdo por aqui e achei a sua didática sobre infoprodutos excelente. 

Como produtor audiovisual, sei que o conhecimento de alto padrão exige um visual à altura. Como demonstração gratuita, peguei um trecho de 15 segundos do seu último Reels e fiz uma edição profissional completa: apliquei color grading de cinema, limpei o áudio (${weakness}) e inseri legendas dinâmicas magnéticas. Ficou fantástico!

Você me permite enviar o link do vídeo editado aqui por Direct? É um presente meu para você postar no seu perfil e sentir a diferença na retenção do seu público.`;

            case 2: // ESTRATÉGIA DO GANCHO DO CONCORRENTE
                return `Olá, ${first}! Tudo bem? 

Trabalhamos na produção de grandes cursos online no Rio (Barra e Zona Sul) e percebemos uma forte movimentação: os experts de maior faturamento do seu nicho estão abandonando os vídeos gravados em casa com celular comum e migrando para gravações com lentes e iluminação cinematográfica. A percepção de autoridade triplicou o preço de suas mentorias.

Gravei um vídeo rápido de 45 segundos analisando o seu perfil comercial e mostrando onde detalhes técnicos (como ${weakness}) estão reduzindo a percepção de alto ticket do seu infoproduto. Posso compartilhar o link do vídeo explicativo aqui com você?`;

            case 3: // ESTRATÉGIA DE PARCERIA E CO-PRODUÇÃO DE CURSO ONLINE
                return `Olá, ${first}! Tudo bem? 

Acompanho seu posicionamento e você possui uma autoridade fantástica que pode ser escalada através de um curso online ou mentoria premium de altíssimo padrão visual.

Nossa produtora audiovisual oferece a co-produção de cursos "chave na mão": nós estruturamos o roteiro com você, trazemos câmeras de cinema e luz profissional ao seu ambiente (ou gravamos em nosso estúdio) e cuidamos de toda a edição das aulas e dos criativos de vendas. Recentemente co-produzimos um curso de Micropigmentação Labial para uma clínica estética renomada que foi um sucesso.

Grascemos a oportunidade de agendar uma rápida chamada de 5 minutos para entender como podemos estruturar e gravar o seu curso online com padrão de cinema sem que você precise se preocupar com a parte técnica?`;
        }
    } else if (lead.niche === 'imoveis_luxo_rio') {
        switch (variationNum) {
            case 1: // BYPASS DO GATEKEEPER / PRESENTES AUDIOVISUAL (Story/Reels Editado)
                return `Olá, ${first}! Tudo bem? Acompanho as belíssimas propriedades que você anuncia na Barra e Zona Sul. 

Como produtor audiovisual de alto padrão imobiliário, fiz uma edição profissional rápida de presente baseada em um dos seus Stories/Reels recentes. Ajustei a iluminação, limpei o áudio das salas vazias (${weakness}) e adicionei legendas de alto impacto para reter o cliente logo nos 3 primeiros segundos.

A diferença visual ficou nítida e muito mais sofisticada. Gostaria que eu te enviasse o link do vídeo editado pronto para você postar? É 100% de cortesia!`;

            case 2: // ESTRATÉGIA DO GANCHO DO CONCORRENTE
                return `Olá, ${first}! Tudo bem? 

No mercado imobiliário de luxo da Barra e Zona Sul, os compradores compram o status e o estilo de vida antes do imóvel. Notamos que corretores concorrentes começaram a investir em vídeos estilo "lifestyle documental cinematográfico" e estão dominando os leads do Direct.

Gravei uma análise rápida de 45 segundos mostrando como os seus vídeos atuais (corrigindo pontos como ${weakness}) podem atrair muito mais clientes de alta renda com esse formato moderno. Posso te enviar o link do vídeo de análise?`;

            case 3: // COMERCIAL DIRETO
                return `Olá, ${first}! Espero que esteja bem.

Ajudamos corretores de imóveis de altíssimo padrão na Barra, Recreio e Zona Sul a dominarem o Instagram através de produções audiovisuais de padrão cinema que geram desejo imediato.

Nós oferecemos a estrutura completa: roteiros com gatilhos de status, captação profissional com estabilizadores de câmera, captação de áudio sem eco e edição ultra premium. Seu único trabalho é apresentar o imóvel diante da nossa lente por 2 horas mensais, nós cuidamos de toda a produção.

Gostaria de receber nosso catálogo com exemplos práticos no WhatsApp para avaliarmos seu próximo lançamento imobiliário?`;
        }
    } else if (lead.niche === 'hipnoterapeutas_terapeutas') {
        switch (variationNum) {
            case 1: // BYPASS DO GATEKEEPER / PRESENTES AUDIOVISUAL (Story/Reels Editado)
                return `Olá, ${first}! Tudo bem? Admiro muito o seu trabalho na hipnoterapia e psicologia clínica. 

Como o seu trabalho envolve extrema confiança e conexão emocional, a qualidade audiovisual é o primeiro contato acolhedor do paciente. Como presente, peguei 15 segundos de um Reels seu e apliquei color grading acolhedor, retirei ruídos de áudio (${weakness}) e adicionei legendas elegantes. Ficou muito humanizado!

Permite que eu te envie o link do vídeo pronto aqui para você ver a diferença? É uma demonstração gratuita de cortesia para ajudar no seu posicionamento.`;

            case 2: // ESTRATÉGIA DO GANCHO DO CONCORRENTE
                return `Olá, ${first}! Tudo bem? 

Percebemos que na área de saúde mental e bem-estar, a clareza acústica e a iluminação confortável são o que diferenciam perfis amadores de autoridades de alto ticket. Perfis com ruídos ou luzes duras perdem pacientes subconscientemente.

Fiz uma breve análise de 45 segundos de como pequenos ajustes audiovisuais no seu perfil (como ${weakness}) poderiam elevar a taxa de conversão do seu link da bio para consultas. Posso enviar o link dessa análise rápida aqui com você?`;

            case 3: // COMERCIAL DIRETO
                return `Olá, ${first}! Espero que esteja bem.

Ajudamos hipnoterapeutas e terapeutas de alta performance a se posicionarem como referências de autoridade através de vídeos cinematográficos e roteiros focados em conexão profunda.

Oferecemos uma solução completa "chave na mão": roteirizamos as dores éticas do seu público, gravamos no seu próprio espaço de atendimento com equipamentos de ponta de forma rápida e entregamos o material inteiramente editado.

Gostaria de agendar uma breve chamada de 5 minutos esta semana para conhecer nosso portfólio voltado a profissionais de saúde e bem-estar?`;
        }
    } else if (lead.niche === 'consorcio_vendas_alta_renda') {
        switch (variationNum) {
            case 1: // BYPASS DO GATEKEEPER / PRESENTES AUDIOVISUAL (Story/Reels Editado)
                return `Olá, ${first}! Tudo bem? Acompanho suas análises excelentes sobre planejamento patrimonial e consórcios. 

No segmento de alta renda, a credibilidade visual é o fator número um que gera segurança financeira no investidor. Como presente, fiz uma edição premium rápida de um dos seus Reels recentes: corrigi a iluminação, otimizei a clareza do áudio (${weakness}) e inseri legendas estilo Forbes/Infomoney. 

O resultado ficou impecável, transmitindo extrema solidez corporativa. Posso te enviar o link do vídeo editado aqui para você dar uma olhada e usar no seu perfil?`;

            case 2: // ESTRATÉGIA DO GANCHO DO CONCORRENTE
                return `Olá, ${first}! Tudo bem? 

O mercado de consórcios premium exige que seu Reels exale o mesmo prestígio das maiores corretoras do país. Vídeos gravados sob luz de teto ou com eco limitam o interesse de investidores exigentes.

Gravei um vídeo diagnóstico de 45 segundos mostrando o padrão audiovisual exato que os canais de alta renda de finanças estão usando e como você pode ajustar o seu perfil (eliminando problemas como ${weakness}) para captar leads qualificados com facilidade. Posso te enviar o link da análise?`;

            case 3: // COMERCIAL DIRETO
                return `Olá, ${first}! Tudo bem?

Auxiliamos consultores de investimentos e corretores de consórcio de alta renda a estruturarem canais de vídeo altamente magnéticos e profissionais no Instagram e YouTube.

Nossa equipe cuida de tudo: montamos a linha editorial, roteirizamos seus criativos, gravamos no seu escritório na Barra ou Zona Sul e entregamos os vídeos editados no padrão corporativo cinemático de canais de elite.

Gostaria de marcar uma chamada rápida de 5 minutos esta semana para conhecer nosso portfólio focado em finanças?`;
        }
    } else { // profissionais_liberais (Advogados / Consultores)
        switch (variationNum) {
            case 1: // BYPASS DO GATEKEEPER / PRESENTES AUDIOVISUAL (Story/Reels Editado)
                return `Olá! Tudo bem? Fiquei impressionado com o prestígio e autoridade do escritório do(a) Dr(a). ${first}. 

Sou diretor de audiovisual corporativo na Barra e Zona Sul e, sabendo que a primeira impressão de um cliente empresarial no Instagram é crucial, fiz uma edição profissional de presente de um dos vídeos de vocês. Apliquei uma correção de cor sóbria, eliminei ruídos acústicos (${weakness}) e inseri legendas executivas discretas. Ficou espetacularmente refinado!

Posso te enviar o link do vídeo pronto aqui para você avaliar e mostrar para ele(a)? É um presente sem compromisso algum para vocês verem a diferença técnica.`;

            case 2: // ESTRATÉGIA DO GANCHO DO CONCORRENTE
                return `Olá, Dr(a). ${first}! Espero que esteja bem.

Na advocacia societária e de negócios, a imagem digital precisa refletir a mesma excelência da sua banca física. Vídeos com ${weakness} reduzem a percepção de prestígio perante grandes empresas na Zona Sul e Barra.

Gravei um diagnóstico de 45 segundos apontando 3 ajustes técnicos rápidos que trarão sobriedade de cinema ao seu perfil, respeitando 100% as diretrizes da OAB. Posso enviar o link desse diagnóstico rápido para você avaliar?`;

            case 3: // COMERCIAL DIRETO
                return `Olá, Dr(a). ${first}! Espero que esteja bem.

Sabemos que o seu tempo deve ser focado em resolver as demandas jurídicas estratégicas de seus clientes, sem que você precise se preocupar com gravação ou edição de vídeo.

Oferecemos uma assessoria audiovisual jurídica completa na Barra e Zona Sul: estruturamos roteiros totalmente adequados à OAB, gravamos no seu próprio escritório em sessões eficientes de apenas 1h30 mensais e entregamos os Reels totalmente editados em alto padrão.

Podemos marcar uma rápida conversa por telefone de 5 minutos para apresentar nossos cases jurídicos de sucesso?`;
        }
    }
}


// --- 4. CRM STATE & BOARD UPDATER ---
function getLeadsByStatus(status) {
    return appState.leads.filter(lead => lead.status === status);
}

function updateLeadStatusInCrm(leadId, newStatus) {
    const leadIndex = appState.leads.findIndex(lead => lead.id === leadId || lead.username === leadId);
    if (leadIndex !== -1) {
        appState.leads[leadIndex].status = newStatus;
        saveCrmToStorage();
        updateCrmDashboardMetrics();
        return true;
    }
    return false;
}

function removeLeadFromCrm(leadId) {
    appState.leads = appState.leads.filter(lead => lead.id !== leadId && lead.username !== leadId);
    saveCrmToStorage();
    updateCrmDashboardMetrics();
}


// --- 5. USER INTERFACE INTERACTION CONTROLLERS ---

// Switch tabs inside SPA
function switchTab(tabName) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-tab') === tabName) {
            item.classList.add('active');
        }
    });

    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });

    const activePane = document.getElementById(`tab-${tabName}`);
    if (activePane) {
        activePane.classList.add('active');
    }

    // Set page header title
    const titles = {
        dashboard: 'Painel Geral',
        icp: 'Definição de Perfil Ideal (ICP)',
        prospector: 'Radar & Analisador de Leads',
        crm: 'Gestão de Funil CRM'
    };
    document.getElementById('page-title').textContent = titles[tabName] || 'Painel';

    // Contextual refresh actions
    if (tabName === 'dashboard') {
        renderRecentLeadsTable();
        updateCrmDashboardMetrics();
    } else if (tabName === 'crm') {
        renderKanbanBoard();
    }
}

// Display Toast Notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let svgIcon = '';
    if (type === 'success') {
        svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (type === 'danger') {
        svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    } else {
        svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            ${svgIcon}
            <span>${message}</span>
        </div>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease-out reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Render leads table in Dashboard
function renderRecentLeadsTable() {
    const tbody = document.getElementById('recent-leads-tbody');
    if (!tbody) return;

    if (appState.leads.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Nenhum lead no CRM ainda. Use a aba "Radar & Analisador" para prospectar!</td></tr>`;
        return;
    }

    tbody.innerHTML = '';
    // Show top 5 recent leads sorted by date added (reverse chronological)
    const recentLeads = [...appState.leads].slice(-5).reverse();
    
    recentLeads.forEach(lead => {
        const initials = lead.fullname ? lead.fullname.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() : lead.username.slice(0,2).toUpperCase();
        
        let scoreClass = 'low';
        if (lead.score >= 70) scoreClass = 'high';
        else if (lead.score >= 50) scoreClass = 'medium';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="lead-profile-td">
                    <div class="avatar-sm">${initials}</div>
                    <div>
                        <span class="lead-username-td">@${lead.username}</span>
                        <span class="lead-name-td">${lead.fullname}</span>
                    </div>
                </div>
            </td>
            <td>${lead.nicheLabel}</td>
            <td>${lead.followers.toLocaleString('pt-BR')}</td>
            <td><span class="badge-score ${scoreClass}">${lead.score}%</span></td>
            <td><span class="badge-status ${lead.status}">${lead.status}</span></td>
            <td>
                <button class="btn-link text-purple" data-action="analyse" data-username="${lead.username}">
                    Ver Abordagem
                </button>
            </td>
        `;
        
        row.querySelector('[data-action="analyse"]').addEventListener('click', (e) => {
            const username = e.target.getAttribute('data-username');
            const foundLead = appState.leads.find(l => l.username === username);
            if (foundLead) {
                appState.currentLeadInAnalysis = foundLead;
                renderActiveLeadResult(foundLead);
                switchTab('prospector');
            }
        });

        tbody.appendChild(row);
    });
}

// Update Dashboard Statistics Cards
function updateCrmDashboardMetrics() {
    const totalLeads = appState.leads.length;
    const qualifiedLeads = appState.leads.filter(l => l.score >= 50).length;
    const contactedLeads = appState.leads.filter(l => l.status === 'abordado').length;
    const dealsWon = appState.leads.filter(l => l.status === 'fechado').length;

    document.getElementById('stat-total-leads').textContent = totalLeads;
    document.getElementById('stat-qualified-leads').textContent = qualifiedLeads;
    
    const pct = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;
    document.getElementById('stat-qualified-pct').textContent = `${pct}% de taxa de alinhamento (ICP)`;
    document.getElementById('stat-contacted-leads').textContent = contactedLeads;
    document.getElementById('stat-deals-won').textContent = dealsWon;

    // Display active ICP label
    const nicheLabels = {
        clinicas_estetica_medicos: 'Clínicas de Estética & Médicos/Cirurgiões',
        infoprodutores_cursos: 'Gravação de Cursos Online & Infoprodutos',
        imoveis_luxo_rio: 'Imóveis de Luxo (RJ)',
        hipnoterapeutas_terapeutas: 'Hipnoterapeutas',
        consorcio_vendas_alta_renda: 'Consórcios Alta Renda',
        profissionais_liberais: 'Advogados & Consultores'
    };
    document.getElementById('active-icp-display').textContent = `ICP Ativo: ${nicheLabels[appState.icp.niche] || 'Nicho Customizado'}`;
}

// Setup dynamic external Google search links
function updateExternalSearchLinks() {
    const icp = appState.icp;
    const link1 = document.getElementById('google-search-link-1');
    const link2 = document.getElementById('google-search-link-2');

    if (!link1 || !link2) return;

    let search1 = '';
    let search2 = '';
    
    if (icp.niche === 'clinicas_estetica_medicos') {
        search1 = 'site:instagram.com "harmonização facial" OR "cirurgião plástico" OR "cirurgia plástica" OR "clínica de estética" "barra" OR "ipanema" OR "leblon" -pessoal';
        search2 = 'site:instagram.com "estética avançada" OR "rinoplastia" "rio de janeiro" OR "rj" -pessoal';
        link1.querySelector('span').textContent = 'Buscar Clínicas/Médicos Barra/Zona Sul';
        link2.querySelector('span').textContent = 'Buscar Estética Avançada RJ';
    } else if (icp.niche === 'infoprodutores_cursos') {
        search1 = 'site:instagram.com "curso online" OR "mentoria" "estética" OR "micropigmentação" "barra" OR "rio de janeiro"';
        search2 = 'site:instagram.com "especialista" OR "expert" "infoproduto" OR "lançamento" -pessoal';
        link1.querySelector('span').textContent = 'Buscar Especialistas Estética & Cursos';
        link2.querySelector('span').textContent = 'Buscar Infoprodutores/Experts RJ';
    } else if (icp.niche === 'imoveis_luxo_rio') {
        search1 = 'site:instagram.com "corretor de imóveis" "alto padrão" OR "luxo" "barra" OR "recreio" OR "zona sul"';
        search2 = 'site:instagram.com "cobertura" OR "mansão" "barra da tijuca" OR "ipanema"';
        link1.querySelector('span').textContent = 'Buscar Corretores de Alto Padrão';
        link2.querySelector('span').textContent = 'Buscar Mansões/Coberturas RJ';
    } else if (icp.niche === 'hipnoterapeutas_terapeutas') {
        search1 = 'site:instagram.com "hipnoterapeuta" OR "hipnose clinica" "barra" OR "rio de janeiro"';
        search2 = 'site:instagram.com "terapeuta" "ansiedade" OR "trauma" "barra da tijuca"';
        link1.querySelector('span').textContent = 'Buscar Hipnoterapeutas Barra/RJ';
        link2.querySelector('span').textContent = 'Buscar Terapeutas de Ansiedade';
    } else if (icp.niche === 'consorcio_vendas_alta_renda') {
        search1 = 'site:instagram.com "especialista em consórcios" OR "consórcio" "alta renda"';
        search2 = 'site:instagram.com "investimentos" "consórcio" "planejamento financeiro"';
        link1.querySelector('span').textContent = 'Buscar Corretores de Consórcio';
        link2.querySelector('span').textContent = 'Buscar Planejadores Alta Renda';
    } else if (icp.niche === 'profissionais_liberais') {
        search1 = 'site:instagram.com "advogado" "societario" OR "tributario" "rio de janeiro"';
        search2 = 'site:instagram.com "advocacia" "barra da tijuca" OR "leblon"';
        link1.querySelector('span').textContent = 'Buscar Advogados RJ';
        link2.querySelector('span').textContent = 'Buscar Escritórios de Advocacia';
    }

    link1.href = `https://www.google.com/search?q=${encodeURIComponent(search1)}`;
    link2.href = `https://www.google.com/search?q=${encodeURIComponent(search2)}`;
}


// --- 6. SIMULATED INSTAGRAM RADAR RADIAL SCANNER ---
let isScanning = false;
function runSimulatedScanner() {
    if (isScanning) return;
    
    isScanning = true;
    const terminal = document.getElementById('scanner-terminal-log');
    const startBtn = document.getElementById('btn-scan-simulated');
    
    startBtn.disabled = true;
    startBtn.classList.add('btn-outline');
    startBtn.classList.remove('btn-purple');
    startBtn.textContent = 'Buscando Leads...';
    
    terminal.innerHTML = '<p class="text-purple">> Iniciando varredura global do Instagram API...</p>';
    
    // Custom delay sequence to mimic scanning APIs
    const steps = [
        { text: '> Conectando ao indexador de tags de alta conversão...', delay: 800, color: 'text-muted' },
        { text: `> Filtrando nicho: [${appState.icp.niche.toUpperCase()}] com seguidores entre ${appState.icp.minFollowers} e ${appState.icp.maxFollowers}...`, delay: 1600, color: 'text-muted' },
        { text: '> Mapeando bios ativas com palavras-chave relevantes...', delay: 2400, color: 'text-muted' },
        { text: `> Buscando gatilhos de dor audiovisual no Reels feed...`, delay: 3200, color: 'text-cyan' },
        { text: '> [!] Encontrados 4 perfis em potencial correspondentes.', delay: 4000, color: 'text-purple' },
        { text: '> Baixando dados de perfis e rodando motor de qualificação...', delay: 4800, color: 'text-muted' }
    ];

    steps.forEach(step => {
        setTimeout(() => {
            const p = document.createElement('p');
            p.className = step.color;
            p.textContent = step.text;
            terminal.appendChild(p);
            terminal.scrollTop = terminal.scrollHeight;
        }, step.delay);
    });

    // Complete scan and return a qualified profile matching the ICP
    setTimeout(() => {
        // Filter catalog profiles based on current ICP niche
        let matchingProfiles = SIMULATED_CATALOG.filter(p => p.niche === appState.icp.niche);
        
        // Fallback to random catalog profile if none matches niche
        if (matchingProfiles.length === 0) {
            matchingProfiles = SIMULATED_CATALOG;
        }

        // Pick a profile that is not already in the CRM
        let leadToDiscover = null;
        for (let profile of matchingProfiles) {
            const exists = appState.leads.some(l => l.username === profile.username);
            if (!exists) {
                leadToDiscover = profile;
                break;
            }
        }

        // Fallback to random if all already added
        if (!leadToDiscover) {
            leadToDiscover = matchingProfiles[Math.floor(Math.random() * matchingProfiles.length)];
        }

        // Qualify this lead using our Engine
        const qualifiedLead = runLeadQualification(leadToDiscover);
        
        // Add ID and dates
        qualifiedLead.id = 'lead_' + Date.now();
        qualifiedLead.dateAdded = new Date().toLocaleDateString('pt-BR');
        
        // Print success on terminal
        const pSuccess = document.createElement('p');
        pSuccess.className = 'text-green';
        pSuccess.textContent = `> [SUCESSO] Lead encontrado: @${qualifiedLead.username} - Score: ${qualifiedLead.score}%`;
        terminal.appendChild(pSuccess);
        terminal.scrollTop = terminal.scrollHeight;

        // Reset button
        startBtn.disabled = false;
        startBtn.classList.remove('btn-outline');
        startBtn.classList.add('btn-purple');
        startBtn.textContent = 'Iniciar Scanner';
        isScanning = false;

        // Select and display results in outreach UI
        appState.currentLeadInAnalysis = qualifiedLead;
        renderActiveLeadResult(qualifiedLead);
        
        showToast(`Lead @${qualifiedLead.username} qualificado! Score: ${qualifiedLead.score}%`, 'success');

    }, 5500);
}

// Display results of qualified lead in the Outreach Copilot Panel
function renderActiveLeadResult(lead) {
    document.getElementById('results-panel-empty').classList.add('hidden');
    document.getElementById('results-panel-active').classList.remove('hidden');

    const initials = lead.fullname ? lead.fullname.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() : lead.username.slice(0,2).toUpperCase();
    
    document.getElementById('res-avatar').textContent = initials;
    document.getElementById('res-fullname').textContent = lead.fullname;
    
    const handleEl = document.getElementById('res-ig-link');
    handleEl.textContent = `@${lead.username}`;
    handleEl.href = `https://instagram.com/${lead.username}`;

    // Score Circular Gauge Update
    document.getElementById('res-score-text').textContent = lead.score;
    const scoreCircle = document.getElementById('res-score-circle');
    const perimeter = 100; // Stroke-dasharray mapping
    scoreCircle.setAttribute('stroke-dasharray', `${lead.score}, ${perimeter}`);

    // Badge styling and text
    const statusBadge = document.getElementById('res-status-badge');
    statusBadge.textContent = lead.status.toUpperCase();
    if (lead.score < 50) {
        statusBadge.className = 'badge red';
    } else {
        statusBadge.className = 'badge';
    }

    document.getElementById('res-niche-badge').textContent = lead.nicheLabel;
    document.getElementById('res-justification-text').textContent = lead.justification;

    // Set outreach tone display label
    const toneLabels = {
        bold: 'Ousado & Vendas',
        professional: 'Profissional/Corporate',
        friendly: 'Amigável/Relacionamento',
        direct: 'Direto/Comercial'
    };
    document.getElementById('res-tone-badge').textContent = `Tom: ${toneLabels[appState.icp.tone] || 'Custom'}`;

    // Render selected variation outreach message
    updateOutreachMessageText();

    // Check if lead is already in CRM to toggle the Save CRM button
    const crmBtn = document.getElementById('btn-add-crm');
    const alreadySaved = appState.leads.some(l => l.username === lead.username);
    if (alreadySaved) {
        crmBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>Salvo no CRM</span>`;
        crmBtn.disabled = true;
        crmBtn.classList.add('btn-outline');
    } else {
        crmBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg><span>Salvar no CRM</span>`;
        crmBtn.disabled = false;
        crmBtn.classList.remove('btn-outline');
    }

    // Direct Web DM link mapping
    // Opens Instagram Web Direct Inbox (or profile page if double click web redirect triggers fallback)
    document.getElementById('btn-send-instagram').href = `https://instagram.com/direct/inbox/`;
}

// Update message text box based on variation tab and tone selection
function updateOutreachMessageText() {
    const lead = appState.currentLeadInAnalysis;
    if (!lead) return;

    const messageTextarea = document.getElementById('res-message-text');
    const msg = generateOutreachMessage(lead, appState.currentMsgVariation, appState.icp.tone);
    messageTextarea.value = msg;
}


// --- 7. KANBAN CRM RENDERING & DRAG-AND-DROP ENGINE ---
function renderKanbanBoard() {
    const columns = ['descoberto', 'qualificado', 'abordado', 'respondido', 'fechado'];
    
    columns.forEach(col => {
        const container = document.getElementById(`cards-${col}`);
        const countBadge = document.getElementById(`count-${col}`);
        if (!container) return;

        const filteredLeads = getLeadsByStatus(col);
        countBadge.textContent = filteredLeads.length;
        container.innerHTML = '';

        if (filteredLeads.length === 0) {
            container.innerHTML = `<div class="text-center text-xs text-muted py-4">Arraste um card aqui</div>`;
            return;
        }

        filteredLeads.forEach(lead => {
            const card = document.createElement('div');
            card.className = 'kanban-card';
            card.setAttribute('draggable', 'true');
            card.setAttribute('data-id', lead.username); // Target by unique username

            // Card structure
            card.innerHTML = `
                <div class="card-lead-title">
                    <span class="card-username">@${lead.username}</span>
                    <span class="card-score">${lead.score}%</span>
                </div>
                <div class="card-niche">${lead.nicheLabel}</div>
                <div class="card-bio-snippet">${lead.bio.replace(/\n/g, ' ')}</div>
                
                <div class="card-actions-row">
                    <label>${lead.followers.toLocaleString('pt-BR')} seg</label>
                    <div class="card-buttons">
                        <button class="card-mini-btn btn-trash" title="Remover Lead" data-action="delete">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                        <button class="card-mini-btn btn-next" title="Promover Etapa" data-action="promote">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                    </div>
                </div>
            `;

            // Card Event listeners for custom click actions
            card.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
                e.stopPropagation();
                removeLeadFromCrm(lead.username);
                renderKanbanBoard();
                showToast(`Lead @${lead.username} removido com sucesso.`, 'info');
            });

            card.querySelector('[data-action="promote"]').addEventListener('click', (e) => {
                e.stopPropagation();
                const nextStages = {
                    descoberto: 'qualificado',
                    qualificado: 'abordado',
                    abordado: 'respondido',
                    respondido: 'fechado',
                    fechado: 'descoberto'
                };
                const nextStatus = nextStages[lead.status] || 'descoberto';
                updateLeadStatusInCrm(lead.username, nextStatus);
                renderKanbanBoard();
                showToast(`Lead promovido para a coluna: ${nextStatus.toUpperCase()}`, 'success');
            });

            card.addEventListener('click', () => {
                appState.currentLeadInAnalysis = lead;
                renderActiveLeadResult(lead);
                switchTab('prospector');
            });

            // HTML5 Drag Event Handlers
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', lead.username);
                card.style.opacity = '0.5';
            });

            card.addEventListener('dragend', () => {
                card.style.opacity = '1';
                // Remove visual indicators from all columns
                document.querySelectorAll('.kanban-cards-container').forEach(el => {
                    el.classList.remove('drag-over');
                });
            });

            container.appendChild(card);
        });
    });
}

// Setup Column Drag & Drop Listeners
function initDragAndDropEvents() {
    const columns = document.querySelectorAll('.kanban-column');
    
    columns.forEach(col => {
        const container = col.querySelector('.kanban-cards-container');
        const colStatus = col.getAttribute('data-column');

        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            container.classList.add('drag-over');
        });

        container.addEventListener('dragleave', () => {
            container.classList.remove('drag-over');
        });

        container.addEventListener('drop', (e) => {
            e.preventDefault();
            container.classList.remove('drag-over');
            
            const leadUsername = e.dataTransfer.getData('text/plain');
            if (leadUsername) {
                const moved = updateLeadStatusInCrm(leadUsername, colStatus);
                if (moved) {
                    renderKanbanBoard();
                    showToast(`Status atualizado para: ${colStatus.toUpperCase()}`, 'info');
                }
            }
        });
    });
}


// --- 8. GLOBAL EVENTS & CONTROLLER WIRE-UP ---
document.addEventListener('DOMContentLoaded', () => {
    // a. Load saved data
    loadFromStorage();
    
    // b. Initialize dashboard stats display
    updateCrmDashboardMetrics();
    renderRecentLeadsTable();
    updateExternalSearchLinks();

    // c. Wire Tab switches
    document.querySelectorAll('.nav-item').forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    // Dashboard Quick Redirects
    document.getElementById('btn-quick-prospect').addEventListener('click', () => {
        switchTab('prospector');
    });
    
    document.getElementById('btn-edit-icp-dash').addEventListener('click', () => {
        switchTab('icp');
    });

    // d. ICP Form Submissions
    const icpForm = document.getElementById('icp-form');
    if (icpForm) {
        // Sync values with current settings initially
        document.getElementById('icp-niche').value = appState.icp.niche;
        document.getElementById('icp-min-followers').value = appState.icp.minFollowers;
        document.getElementById('icp-max-followers').value = appState.icp.maxFollowers;
        document.getElementById('icp-keywords').value = appState.icp.keywords;
        document.getElementById('icp-redflags').value = appState.icp.redFlags;
        document.getElementById('icp-tone').value = appState.icp.tone;
        document.getElementById('check-bad-audio').checked = appState.icp.opportunites.badAudio;
        document.getElementById('check-bad-lighting').checked = appState.icp.opportunites.badLighting;
        document.getElementById('check-bad-editing').checked = appState.icp.opportunites.badEditing;
        document.getElementById('check-no-reels').checked = appState.icp.opportunites.noReels;

        icpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            appState.icp = {
                niche: document.getElementById('icp-niche').value,
                minFollowers: parseInt(document.getElementById('icp-min-followers').value) || 2000,
                maxFollowers: parseInt(document.getElementById('icp-max-followers').value) || 100000,
                opportunites: {
                    badAudio: document.getElementById('check-bad-audio').checked,
                    badLighting: document.getElementById('check-bad-lighting').checked,
                    badEditing: document.getElementById('check-bad-editing').checked,
                    noReels: document.getElementById('check-no-reels').checked
                },
                keywords: document.getElementById('icp-keywords').value,
                redFlags: document.getElementById('icp-redflags').value,
                tone: document.getElementById('icp-tone').value
            };

            saveIcpToStorage();
            updateCrmDashboardMetrics();
            updateExternalSearchLinks();
            showToast('Critérios do ICP salvos com sucesso!', 'success');
        });
    }

    // e. Switch modes inside the Lead Analyzer
    const btnRadar = document.getElementById('btn-mode-radar');
    const btnManual = document.getElementById('btn-mode-manual');
    const radarContainer = document.getElementById('source-radar-container');
    const manualContainer = document.getElementById('source-manual-container');

    btnRadar.addEventListener('click', () => {
        btnRadar.className = 'btn btn-flex btn-purple';
        btnManual.className = 'btn btn-flex btn-outline';
        radarContainer.classList.remove('hidden');
        manualContainer.classList.add('hidden');
    });

    btnManual.addEventListener('click', () => {
        btnManual.className = 'btn btn-flex btn-purple';
        btnRadar.className = 'btn btn-flex btn-outline';
        manualContainer.classList.remove('hidden');
        radarContainer.classList.add('hidden');
    });

    // f. Run Scanner simulated
    document.getElementById('btn-scan-simulated').addEventListener('click', runSimulatedScanner);

    // g. Manual lead qualify form submit
    const manualForm = document.getElementById('manual-lead-form');
    if (manualForm) {
        manualForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const rawLead = {
                username: document.getElementById('manual-username').value.trim().toLowerCase().replace('@', ''),
                fullname: document.getElementById('manual-fullname').value.trim(),
                followers: parseInt(document.getElementById('manual-followers').value) || 0,
                niche: document.getElementById('manual-niche').value,
                bio: document.getElementById('manual-bio').value,
                lightingOpportunity: document.getElementById('man-check-lighting').checked,
                audioOpportunity: document.getElementById('man-check-audio').checked,
                editingOpportunity: document.getElementById('man-check-editing').checked,
                reelsOpportunity: document.getElementById('man-check-frequency').checked
            };

            const qualified = runLeadQualification(rawLead);
            qualified.id = 'lead_' + Date.now();
            qualified.dateAdded = new Date().toLocaleDateString('pt-BR');

            appState.currentLeadInAnalysis = qualified;
            renderActiveLeadResult(qualified);
            showToast('Lead qualificado manualmente!', 'success');
        });
    }

    // h. Outreach message variation switcher
    document.querySelectorAll('[data-msg-var]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-msg-var]').forEach(b => {
                b.className = 'btn btn-xs btn-outline flex-1';
            });
            e.target.className = 'btn btn-xs btn-purple flex-1 active';
            
            appState.currentMsgVariation = parseInt(e.target.getAttribute('data-msg-var'));
            updateOutreachMessageText();
        });
    });

    // i. Copy to Clipboard Outreach Message
    document.getElementById('btn-copy-outreach').addEventListener('click', () => {
        const text = document.getElementById('res-message-text').value;
        navigator.clipboard.writeText(text).then(() => {
            showToast('Abordagem copiada para a área de transferência!', 'success');
        }).catch(() => {
            showToast('Erro ao copiar abordagem.', 'danger');
        });
    });

    // j. Save Lead to CRM Kanban
    document.getElementById('btn-add-crm').addEventListener('click', () => {
        const lead = appState.currentLeadInAnalysis;
        if (!lead) return;

        // Check duplicates
        const exists = appState.leads.some(l => l.username === lead.username);
        if (exists) {
            showToast('Este lead já está cadastrado no seu CRM!', 'warning');
            return;
        }

        // Set initial status to qualified or discovered based on score
        lead.status = 'qualificado';
        appState.leads.push(lead);
        saveCrmToStorage();
        updateCrmDashboardMetrics();
        
        showToast(`Lead @${lead.username} salvo na coluna "QUALIFICADO"!`, 'success');
        
        // Disable button visually
        const crmBtn = document.getElementById('btn-add-crm');
        crmBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>Salvo no CRM</span>`;
        crmBtn.disabled = true;
        crmBtn.classList.add('btn-outline');
    });

    // k. Initialize Drag and Drop Listeners for Kanban
    initDragAndDropEvents();
});
