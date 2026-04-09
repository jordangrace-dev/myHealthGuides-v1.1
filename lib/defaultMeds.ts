export const DEFAULT_MEDS = [
  {
    name: 'Metformin',
    dose: '500 mg',
    instruction: 'Take with food',
    doses: [
      { time: '7:00 AM', status: 'pending', notes: [], showNotes: false },
      { time: '7:00 PM', status: 'pending', notes: [], showNotes: false },
    ],
    reminderOn: true,
    reminderTime: '7:00 AM',
    showPreview: false,
  },
  {
    name: 'Lisinopril',
    dose: '10 mg',
    instruction: 'Same time daily',
    doses: [
      { time: '8:00 AM', status: 'pending', notes: [], showNotes: false },
    ],
    reminderOn: false,
    reminderTime: '8:00 AM',
    showPreview: false,
  },
  {
    name: 'Atorvastatin',
    dose: '20 mg',
    instruction: 'Evening medication',
    doses: [
      { time: '9:00 PM', status: 'pending', notes: [], showNotes: false },
    ],
    reminderOn: true,
    reminderTime: '9:00 PM',
    showPreview: false,
  },
];