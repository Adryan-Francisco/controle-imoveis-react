import React from 'react';
import { Select, Group, Text, useMantineTheme } from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';

export function YearSelector({ value, onChange, yearOptions, isMobile }) {
  const theme = useMantineTheme();

  return (
    <Group gap="xs">
      <IconCalendar size={20} color={theme.colors.blue[6]} />
      <Select
        placeholder="Selecionar ano"
        data={yearOptions}
        value={value}
        onChange={onChange}
        searchable
        clearable={false}
        maxDropdownHeight={200}
        w={isMobile ? 100 : 120}
        styles={{
          input: {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            borderColor: theme.colors.blue[4],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            padding: isMobile ? '6px 8px' : '8px 10px',
            borderRadius: theme.radius.md,
          },
          option: {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
            '&[data-selected]': {
              backgroundColor: theme.colors.blue[6],
              color: theme.white,
            },
          },
          dropdown: {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            borderColor: theme.colors.blue[4],
          },
        }}
      />
    </Group>
  );
}
