/**
 * @fileoverview Modal para gerar boletos MEI via Receita Federal
 */

import { useState, useEffect } from 'react';
import {
  Modal,
  Stack,
  Group,
  Button,
  TextInput,
  Select,
  Alert,
  Badge,
  Code,
  Center,
  Text,
  CopyButton,
  Tooltip,
  Loader,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconCheck,
  IconCopy,
  IconDownload,
  IconExternalLink,
} from '@tabler/icons-react';
import {
  buscarBoletoMEI,
  validarCPF,
  abrirBoletoMEINavegador,
} from '../utils/meiBoletosReceita';

export function MEIBoletoModal({ opened, onClose, empresa }) {
  const [cnpj, setCNPJ] = useState('');
  const [mes, setMes] = useState(String(new Date().getMonth() + 1));
  const [boleto, setBoleto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  // Pré-preencher CNPJ se empresa MEI
  useEffect(() => {
    if (opened && empresa?.type === 'MEI' && empresa?.cnpj) {
      setCNPJ(empresa.cnpj);
    }
  }, [opened, empresa]);

  const handleGerarBoleto = async () => {
    try {
      setErro(null);
      setLoading(true);

      // Remover formatação e validar CNPJ
      const cnpjLimpo = cnpj.replace(/\D/g, '');

      // Verificar se tem 14 dígitos
      if (cnpjLimpo.length !== 14) {
        setErro('CNPJ deve ter 14 dígitos (com ou sem formatação).');
        return;
      }

      // Extrair CPF dos primeiros 11 dígitos do CNPJ
      const cpfDoMei = cnpjLimpo.substring(0, 11);

      // Validar CPF
      if (!validarCPF(cpfDoMei)) {
        setErro('CNPJ inválido. Verifique se tem 14 dígitos e tente novamente.');
        return;
      }

      // Buscar boleto com ano atual
      const anoAtual = new Date().getFullYear();
      const boletoGerado = await buscarBoletoMEI(cpfDoMei, parseInt(mes), anoAtual);
      setBoleto(boletoGerado);
    } catch (error) {
      setErro(error.message || 'Erro ao gerar boleto');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirReceitaFederal = () => {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    if (cnpjLimpo.length === 14) {
      const cpfDoMei = cnpjLimpo.substring(0, 11);
      const anoAtual = new Date().getFullYear();
      abrirBoletoMEINavegador(cpfDoMei, parseInt(mes), anoAtual);
    }
  };

  const meses = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: new Date(2024, i).toLocaleString('pt-BR', { month: 'long' }),
  }));

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="🏢 Boleto MEI - Receita Federal"
      size="lg"
      centered
    >
      <Stack gap="md">
        {/* Info */}
        <Alert icon={<IconAlertCircle size={16} />} title="Informações" color="blue">
          Gere o boleto de contribuição mensal do MEI diretamente do sistema da Receita Federal.
        </Alert>

        {/* Erro */}
        {erro && (
          <Alert icon={<IconAlertCircle size={16} />} title="Erro" color="red">
            {erro}
          </Alert>
        )}

        {/* Formulário */}
        {!boleto ? (
          <Stack gap="md">
            <TextInput
              label="CNPJ (com ou sem formatação)"
              placeholder="00.000.000/0000-00 ou 00000000000000"
              value={cnpj}
              onChange={(e) => setCNPJ(e.currentTarget.value)}
              required
              disabled={loading}
              description="O MEI usa os primeiros 11 dígitos como CPF"
            />

            <Group grow>
              <Select
                label="Mês"
                placeholder="Selecione o mês"
                data={meses}
                value={mes}
                onChange={(value) => setMes(value || '')}
                disabled={loading}
                required
              />
            </Group>

            <Button
              onClick={handleGerarBoleto}
              loading={loading}
              fullWidth
              leftSection={<IconDownload size={16} />}
            >
              {loading ? 'Gerando boleto...' : 'Gerar Boleto'}
            </Button>

            <Button
              onClick={handleAbrirReceitaFederal}
              variant="light"
              fullWidth
              leftSection={<IconExternalLink size={16} />}
            >
              Abrir Receita Federal
            </Button>
          </Stack>
        ) : (
          /* Resultado */
          <Stack gap="md">
            <Alert icon={<IconCheck size={16} />} title="Sucesso!" color="green">
              Boleto gerado com sucesso! ✅
            </Alert>

            {/* Status */}
            <Stack gap="xs">
              <Group justify="space-between">
                <Text fw={500}>Status:</Text>
                <Badge color="green">Ativo</Badge>
              </Group>

              <Group justify="space-between">
                <Text fw={500}>Vencimento:</Text>
                <Text>{new Date(boleto.datavencimento).toLocaleDateString('pt-BR')}</Text>
              </Group>

              <Group justify="space-between">
                <Text fw={500}>Valor:</Text>
                <Text fw={700}>R$ {boleto.valor.toFixed(2)}</Text>
              </Group>

              <Group justify="space-between">
                <Text fw={500}>Período:</Text>
                <Text>
                  {String(boleto.mes).padStart(2, '0')}/{boleto.ano}
                </Text>
              </Group>
            </Stack>

            {/* Linha Digitável */}
            <Stack gap="xs">
              <Text fw={500}>Linha Digitável:</Text>
              <Group gap="xs">
                <Code style={{ flex: 1, wordBreak: 'break-all' }}>
                  {boleto.linhaDigitavel}
                </Code>
                <CopyButton value={boleto.linhaDigitavel} timeout={2000}>
                  {({ copied }) => (
                    <Tooltip
                      label={copied ? 'Copiado!' : 'Copiar'}
                      withArrow
                      position="right"
                    >
                      <Button
                        color={copied ? 'teal' : 'gray'}
                        variant="light"
                        size="sm"
                        leftSection={<IconCopy size={16} />}
                      >
                        {copied ? 'OK' : 'Copiar'}
                      </Button>
                    </Tooltip>
                  )}
                </CopyButton>
              </Group>
            </Stack>

            {/* Código de Barras */}
            <Stack gap="xs">
              <Text fw={500}>Código de Barras:</Text>
              <Code style={{ wordBreak: 'break-all', fontSize: 11 }}>
                {boleto.codigoBarras}
              </Code>
            </Stack>

            {/* Número do Boleto */}
            <Stack gap="xs">
              <Text fw={500}>Número do Boleto:</Text>
              <Code>{boleto.numerodiferenca}</Code>
            </Stack>

            {/* Botões de Ação */}
            <Group grow>
              <Button
                onClick={handleAbrirReceitaFederal}
                variant="light"
                leftSection={<IconExternalLink size={16} />}
              >
                Abrir no Navegador
              </Button>

              <Button onClick={() => setBoleto(null)} variant="default">
                Gerar Novo
              </Button>
            </Group>

            <Button onClick={onClose} fullWidth>
              Fechar
            </Button>
          </Stack>
        )}
      </Stack>
    </Modal>
  );
}

export default MEIBoletoModal;
