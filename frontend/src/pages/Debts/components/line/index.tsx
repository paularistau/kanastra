import React, { memo, useCallback, useMemo } from 'react';

import {
  HeaderText,
  LineViewStatus,
  LineViewText,
  Text,
} from '../../../../components/itemList/styles';
import { LineView } from '../../../../components/itemList';
import { IDebt, IDebtStatusEnum } from '../../../../interfaces/debts';
import {
  MdOutlineCheckCircleOutline,
  MdRemoveCircleOutline,
  MdMail,
} from 'react-icons/md';
import { colors } from '../../../../constants';
import Tooltip from '../../../../components/Tooltip';
import { PrimaryButton } from '../../../../components/button';
import { sendEmail } from '../../../../functions/debts';
import { toast } from 'react-toastify';

interface IDebtComponent {
  debt: IDebt;
  onClick: (value: any) => void;
}

function DebtComponent({ debt, onClick }: IDebtComponent) {
  const notifySuccess = () => {
    toast.success('E-mail enviado ao destinatário', { autoClose: 600 });
  };
  const notifyError = () => {
    toast.error('Erro ao enviar E-mail ao destinatário', { autoClose: 600 });
  };

  const status = useMemo(() => {
    if (debt.status.toString() === 'PAYED') {
      return (
        <Tooltip text="Aprovado">
          <MdOutlineCheckCircleOutline color={colors.success} size={28} />
        </Tooltip>
      );
    }
    return (
      <Tooltip text="Pendente">
        <MdRemoveCircleOutline color={colors.yellow} size={28} />
      </Tooltip>
    );
  }, [debt]);

  const handleEmail = useCallback(async (id) => {
    try {
      const response = await sendEmail(debt.debtId);

      if (response.error) {
        notifyError();
      } else {
        notifySuccess();
      }
      return response;
    } catch (error) {
      console.error('Unable to send email', error);
    }
  }, []);

  return (
    <>
      <LineView
        onClick={(e) => onClick(e.target)}
        hasHeader={true}
        headerChildren={<></>}
        columnsSizes="5% 10%  20%  15%  8%  15%  5% 5%"
      >
        <LineViewText>{debt.debtId}</LineViewText>
        <LineViewText>{debt.name}</LineViewText>
        <LineViewText>{debt.email}</LineViewText>
        <LineViewText>{debt.governmentId}</LineViewText>
        <LineViewText>{debt.debtAmount}</LineViewText>
        <LineViewText>{debt.debtDueDate.toLocaleString()}</LineViewText>
        <LineViewText>{status}</LineViewText>
        {debt.status.toString() !== 'PAYED' && (
          <LineViewText>
            <Tooltip text="Enviar e-mail">
              <MdMail onClick={handleEmail} size={24} cursor={'pointer'} />
            </Tooltip>
          </LineViewText>
        )}
      </LineView>
    </>
  );
}

export const DebtLine = memo(DebtComponent);
