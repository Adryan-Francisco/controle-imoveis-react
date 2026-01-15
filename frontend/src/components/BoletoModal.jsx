import { useState } from 'react';
import {
  Modal,
  Button,
  Stack,
  Group,
  Text,
  Divider,
  NumberInput,
  TextInput,
  Badge,
  Alert,
  Loader,
} from '@mantine/core';
import { IconAlertCircle, IconFileText, IconCheck } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { coraAPI } from '../utils/coraAPI';

export function BoletoModal({ opened, onClose, company, onGenerateBoleto }) {
  const [amount, setAmount] = useState(company?.monthlyFee || 0);
  const [dueDate, setDueDate] = useState(
    dayjs().date(company?.dueDay || 5).format('YYYY-MM-DD')
  );
  const [boletoData, setBoletoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateBoleto = async () => {
    if (!company) return;

    setLoading(true);
    setError(null);

    try {
      // Preparar dados para API do Cora
      const coraPayload = {
        beneficiaryName: company.name,
        cnpj: company.cnpj,
        beneficiaryEmail: company.email,
        payerName: company.responsibleName || 'Cliente',
        payerEmail: company.email,
        amount,
        dueDate,
        description: `Mensalidade - ${company.name}`,
        instructions: `Boleto para pagamento de mensalidade de ${company.name}`,
      };

      // Validar dados
      const validation = coraAPI.validateBoletoData(coraPayload);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }

      // Gerar boleto na API do Cora
      const result = await coraAPI.generateBoleto(coraPayload);

      if (!result.success) {
        throw new Error(result.error || 'Erro ao gerar boleto');
      }

      // Armazenar dados do boleto gerado
      setBoletoData(result.data);

      // Chamar callback com os dados completos
      onGenerateBoleto({
        amount,
        barcode: result.data.barcode,
        boletoNumber: result.data.boletoNumber,
        dueDate,
        coraId: result.data.id,
        pdfUrl: result.data.pdfUrl,
        status: 'issued',
      });
    } catch (err) {
      setError(err.message);
      console.error('Erro ao gerar boleto:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!boletoData?.id) return;

    try {
      const pdf = await coraAPI.getBoletoPDF(boletoData.id);
      const url = window.URL.createObjectURL(pdf);
      const link = document.createElement('a');
      link.href = url;
      link.download = `boleto-${boletoData.boletoNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      setError('Erro ao baixar PDF: ' + err.message);
    }
  };

  const resetForm = () => {
    setAmount(company?.monthlyFee || 0);
    setBoletoData(null);
    setError(null);
    setDueDate(dayjs().date(company?.dueDay || 5).format('YYYY-MM-DD'));
  };

  if (!company) return null;

  return (
    <Modal
      opened={opened}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title={
        <Group gap="xs">
          <IconFileText size={20} />
          <Text fw={600}>Gerar Boleto</Text>
        </Group>
      }
      size="md"
      centered
    >
      <Stack gap="md">
        <div>
          <Text fw={500} size="sm" c="dimmed">
            Empresa
          </Text>
          <Text fw={600}>{company.name}</Text>
        </div>

        <Divider />

        <div>
          <Badge color="blue" variant="light" mb="xs">
            {company.regimeType === 'mei'
              ? 'MEI'
              : 'Simples Nacional'}
          </Badge>
        </div>

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" title="Erro">
            {error}
          </Alert>
        )}

        {!boletoData ? (
          <>
            <NumberInput
              label="Valor (R$)"
              placeholder="0.00"
              value={amount}
              onChange={setAmount}
              min={0}
              step={0.01}
              decimalSeparator=","
              thousandsSeparator="."
              required
              disabled={loading}
            />

            <TextInput
              label="Data de Vencimento"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.currentTarget.value)}
              required
              disabled={loading}
            />

            <Group justify="flex-end" mt="xl">
              <Button
                variant="default"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleGenerateBoleto}
                loading={loading}
              >
                {loading ? (
                  <>
                    <Loader size="xs" mr="xs" />
                    Gerando...
                  </>
                ) : (
                  'Gerar Boleto'
                )}
              </Button>
            </Group>
          </>
        ) : (
          <>
            <Alert icon={<IconCheck size={16} />} color="green" title="Boleto Gerado com Sucesso!">
              <Stack gap="xs">
                <div>
                  <Text fw={500} size="sm">
                    Número do Boleto
                  </Text>
                  <TextInput
                    value={boletoData.boletoNumber}
                    readOnly
                    styles={{ input: { fontFamily: 'monospace', fontSize: '12px' } }}
                  />
                </div>
                <div>
                  <Text fw={500} size="sm">
                    Código de Barras
                  </Text>
                  <TextInput
                    value={boletoData.barcode}
                    readOnly
                    styles={{ input: { fontFamily: 'monospace', fontSize: '12px' } }}
                  />
                </div>
                <div>
                  <Text fw={500} size="sm">
                    Valor
                  </Text>
                  <Text fw={600}>
                    R$ {amount.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </div>
                <div>
                  <Text fw={500} size="sm">
                    Vencimento
                  </Text>
                  <Text fw={600}>
                    {dayjs(dueDate).format('DD/MM/YYYY')}
                  </Text>
                </div>
              </Stack>
            </Alert>

            <Group justify="flex-end" mt="xl">
              <Button
                variant="light"
                onClick={handleDownloadPDF}
              >
                Baixar PDF
              </Button>
              <Button
                onClick={() => {
                  resetForm();
                  onClose();
                }}
              >
                Fechar
              </Button>
            </Group>
          </>
        )}
      </Stack>
    </Modal>
  );
}
