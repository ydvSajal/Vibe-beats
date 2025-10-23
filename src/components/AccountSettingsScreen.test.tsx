import { render, screen, fireEvent } from '@testing-library/react';
import { AccountSettingsScreen } from './AccountSettingsScreen';
import '@testing-library/jest-dom';


describe('AccountSettingsScreen', () => {
  test('disables notification toggles when push notifications are off', () => {
    render(<AccountSettingsScreen onBack={() => {}} />);

    const pushNotificationsToggle = screen.getByRole('switch', { name: /Push Notifications/i });
    fireEvent.click(pushNotificationsToggle);

    const emailNotificationsToggle = screen.getByRole('switch', { name: /Email Notifications/i });
    const matchNotificationsToggle = screen.getByRole('switch', { name: /New Matches/i });
    const messageNotificationsToggle = screen.getByRole('switch', { name: /Messages/i });

    expect(emailNotificationsToggle).toBeDisabled();
    expect(matchNotificationsToggle).toBeDisabled();
    expect(messageNotificationsToggle).toBeDisabled();
  });
});
