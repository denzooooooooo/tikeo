const React = require('react');

const createIcon = (children) => {
  return function Icon({ className = '', size = 20 }) {
    return React.createElement(
      'svg',
      {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        className,
      },
      children
    );
  };
};

const SearchIcon = createIcon([
  React.createElement('circle', { key: 'c1', cx: '11', cy: '11', r: '8' }),
  React.createElement('path', { key: 'p1', d: 'm21 21-4.35-4.35' }),
]);

const UserIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M20 21a8 8 0 0 0-16 0' }),
  React.createElement('circle', { key: 'c1', cx: '12', cy: '7', r: '4' }),
]);

const UsersIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }),
  React.createElement('circle', { key: 'c1', cx: '9', cy: '7', r: '4' }),
  React.createElement('path', { key: 'p2', d: 'M22 21v-2a4 4 0 0 0-3-3.87' }),
  React.createElement('path', { key: 'p3', d: 'M16 3.13a4 4 0 0 1 0 7.75' }),
]);

const MenuIcon = createIcon([
  React.createElement('line', { key: 'l1', x1: '4', y1: '6', x2: '20', y2: '6' }),
  React.createElement('line', { key: 'l2', x1: '4', y1: '12', x2: '20', y2: '12' }),
  React.createElement('line', { key: 'l3', x1: '4', y1: '18', x2: '20', y2: '18' }),
]);

const CloseIcon = createIcon([
  React.createElement('line', { key: 'l1', x1: '18', y1: '6', x2: '6', y2: '18' }),
  React.createElement('line', { key: 'l2', x1: '6', y1: '6', x2: '18', y2: '18' }),
]);

const TicketIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z' }),
]);

const ArrowRightIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M5 12h14' }),
  React.createElement('path', { key: 'p2', d: 'm12 5 7 7-7 7' }),
]);

const ArrowLeftIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M19 12H5' }),
  React.createElement('path', { key: 'p2', d: 'm12 19-7-7 7-7' }),
]);

const BellIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9' }),
  React.createElement('path', { key: 'p2', d: 'M13.73 21a2 2 0 0 1-3.46 0' }),
]);

const CalendarIcon = createIcon([
  React.createElement('rect', { key: 'r1', width: '18', height: '18', x: '3', y: '4', rx: '2' }),
  React.createElement('line', { key: 'l1', x1: '16', y1: '2', x2: '16', y2: '6' }),
  React.createElement('line', { key: 'l2', x1: '8', y1: '2', x2: '8', y2: '6' }),
  React.createElement('line', { key: 'l3', x1: '3', y1: '10', x2: '21', y2: '10' }),
]);

const ClockIcon = createIcon([
  React.createElement('circle', { key: 'c1', cx: '12', cy: '12', r: '10' }),
  React.createElement('polyline', { key: 'p1', points: '12 6 12 12 16 14' }),
]);

const LocationIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' }),
  React.createElement('circle', { key: 'c1', cx: '12', cy: '10', r: '3' }),
]);

const HeartIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'm12 21-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09A6.03 6.03 0 0 1 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18Z' }),
]);

const SettingsIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' }),
  React.createElement('circle', { key: 'c1', cx: '12', cy: '12', r: '3' }),
]);

const MusicIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M9 18V5l12-2v13' }),
  React.createElement('circle', { key: 'c1', cx: '6', cy: '18', r: '3' }),
  React.createElement('circle', { key: 'c2', cx: '18', cy: '16', r: '3' }),
]);

const SportsIcon = createIcon([
  React.createElement('circle', { key: 'c1', cx: '12', cy: '12', r: '9' }),
  React.createElement('path', { key: 'p1', d: 'M4.93 4.93 19.07 19.07' }),
  React.createElement('path', { key: 'p2', d: 'M19.07 4.93 4.93 19.07' }),
]);

const TheaterIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M2 8s3-2 5-2 5 2 5 2 3-2 5-2 5 2 5 2v8s-3 2-5 2-5-2-5-2-3 2-5 2-5-2-5-2Z' }),
]);

const FestivalIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M12 2v20' }),
  React.createElement('path', { key: 'p2', d: 'M5 7h14' }),
  React.createElement('path', { key: 'p3', d: 'M7 12h10' }),
]);

const ConferenceIcon = createIcon([
  React.createElement('circle', { key: 'c1', cx: '9', cy: '7', r: '3' }),
  React.createElement('path', { key: 'p1', d: 'M2 21v-2a7 7 0 0 1 14 0v2' }),
]);

const ArtIcon = createIcon([
  React.createElement('circle', { key: 'c1', cx: '13.5', cy: '6.5', r: '.5' }),
  React.createElement('path', { key: 'p1', d: 'M12 22a10 10 0 1 1 0-20 7 7 0 0 1 0 14h-1a2 2 0 0 0 0 4z' }),
]);

const FoodIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M8 2v7' }),
  React.createElement('path', { key: 'p2', d: 'M12 2v7' }),
  React.createElement('path', { key: 'p3', d: 'M10 9v13' }),
]);

const FamilyIcon = createIcon([
  React.createElement('circle', { key: 'c1', cx: '9', cy: '7', r: '3' }),
  React.createElement('circle', { key: 'c2', cx: '17', cy: '8', r: '2.5' }),
]);

const PlusIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M12 5v14' }),
  React.createElement('path', { key: 'p2', d: 'M5 12h14' }),
]);

const ChartIcon = createIcon([
  React.createElement('line', { key: 'l1', x1: '18', y1: '20', x2: '18', y2: '10' }),
  React.createElement('line', { key: 'l2', x1: '12', y1: '20', x2: '12', y2: '4' }),
  React.createElement('line', { key: 'l3', x1: '6', y1: '20', x2: '6', y2: '14' }),
]);

const BarChartIcon = ChartIcon;

const StarIcon = createIcon([
  React.createElement('polygon', { key: 'p1', points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' }),
]);

const CheckCircleIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }),
  React.createElement('polyline', { key: 'p2', points: '22 4 12 14.01 9 11.01' }),
]);

const XCircleIcon = createIcon([
  React.createElement('circle', { key: 'c1', cx: '12', cy: '12', r: '10' }),
  React.createElement('line', { key: 'l1', x1: '15', y1: '9', x2: '9', y2: '15' }),
  React.createElement('line', { key: 'l2', x1: '9', y1: '9', x2: '15', y2: '15' }),
]);

const RefreshIcon = createIcon([
  React.createElement('polyline', { key: 'p1', points: '23 4 23 10 17 10' }),
  React.createElement('polyline', { key: 'p2', points: '1 20 1 14 7 14' }),
  React.createElement('path', { key: 'p3', d: 'M3.51 9a9 9 0 0 1 14.85-3.36L23 10' }),
  React.createElement('path', { key: 'p4', d: 'M20.49 15a9 9 0 0 1-14.85 3.36L1 14' }),
]);

const ShareIcon = createIcon([
  React.createElement('circle', { key: 'c1', cx: '18', cy: '5', r: '3' }),
  React.createElement('circle', { key: 'c2', cx: '6', cy: '12', r: '3' }),
  React.createElement('circle', { key: 'c3', cx: '18', cy: '19', r: '3' }),
  React.createElement('line', { key: 'l1', x1: '8.59', y1: '13.51', x2: '15.42', y2: '17.49' }),
  React.createElement('line', { key: 'l2', x1: '15.41', y1: '6.51', x2: '8.59', y2: '10.49' }),
]);

const CopyIcon = createIcon([
  React.createElement('rect', { key: 'r1', x: '9', y: '9', width: '13', height: '13', rx: '2' }),
  React.createElement('path', { key: 'p1', d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' }),
]);

const EditIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' }),
  React.createElement('path', { key: 'p2', d: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' }),
]);

const TrashIcon = createIcon([
  React.createElement('polyline', { key: 'p1', points: '3 6 5 6 21 6' }),
  React.createElement('path', { key: 'p2', d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6' }),
  React.createElement('path', { key: 'p3', d: 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' }),
]);

const GlobeIcon = createIcon([
  React.createElement('circle', { key: 'c1', cx: '12', cy: '12', r: '10' }),
  React.createElement('line', { key: 'l1', x1: '2', y1: '12', x2: '22', y2: '12' }),
]);

const MoonIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M21 12.79A9 9 0 1 1 11.21 3c0 5 4 9 9 9z' }),
]);

const LockIcon = createIcon([
  React.createElement('rect', { key: 'r1', x: '3', y: '11', width: '18', height: '11', rx: '2' }),
  React.createElement('path', { key: 'p1', d: 'M7 11V7a5 5 0 0 1 10 0v4' }),
]);

const ShieldIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' }),
]);

const ShieldCheckIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' }),
  React.createElement('path', { key: 'p2', d: 'm9 12 2 2 4-4' }),
]);

const MailIcon = createIcon([
  React.createElement('rect', { key: 'r1', x: '2', y: '4', width: '20', height: '16', rx: '2' }),
  React.createElement('path', { key: 'p1', d: 'm22 7-10 6L2 7' }),
]);

const MailOpenIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M2 8l10 6 10-6' }),
  React.createElement('path', { key: 'p2', d: 'M2 8v10h20V8' }),
]);

const PhoneIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.61 2.62a2 2 0 0 1-.45 2.11L8 9.83a16 16 0 0 0 6.17 6.17l1.38-1.27a2 2 0 0 1 2.11-.45c.84.28 1.72.49 2.62.61A2 2 0 0 1 22 16.92z' }),
]);

const FileIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
  React.createElement('polyline', { key: 'p2', points: '14 2 14 8 20 8' }),
]);

const CameraIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z' }),
  React.createElement('circle', { key: 'c1', cx: '12', cy: '13', r: '4' }),
]);

const EyeIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z' }),
  React.createElement('circle', { key: 'c1', cx: '12', cy: '12', r: '3' }),
]);

const DollarIcon = createIcon([
  React.createElement('line', { key: 'l1', x1: '12', y1: '1', x2: '12', y2: '23' }),
  React.createElement('path', { key: 'p1', d: 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' }),
]);

const CreditCardIcon = createIcon([
  React.createElement('rect', { key: 'r1', x: '1', y: '4', width: '22', height: '16', rx: '2' }),
  React.createElement('line', { key: 'l1', x1: '1', y1: '10', x2: '23', y2: '10' }),
]);

const OrderIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M9 11l3 3L22 4' }),
  React.createElement('path', { key: 'p2', d: 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' }),
]);

const TargetIcon = createIcon([
  React.createElement('circle', { key: 'c1', cx: '12', cy: '12', r: '10' }),
  React.createElement('circle', { key: 'c2', cx: '12', cy: '12', r: '6' }),
  React.createElement('circle', { key: 'c3', cx: '12', cy: '12', r: '2' }),
]);

const TrophyIcon = createIcon([
  React.createElement('path', { key: 'p1', d: 'M8 21h8' }),
  React.createElement('path', { key: 'p2', d: 'M12 17v4' }),
  React.createElement('path', { key: 'p3', d: 'M7 4h10v5a5 5 0 0 1-10 0V4z' }),
]);

const PlayIcon = createIcon([
  React.createElement('polygon', { key: 'p1', points: '5 3 19 12 5 21 5 3' }),
]);

const FilterIcon = createIcon([
  React.createElement('polygon', { key: 'p1', points: '22 3 2 3 10 12 10 19 14 21 14 12 22 3' }),
]);

const PercentIcon = createIcon([
  React.createElement('line', { key: 'l1', x1: '19', y1: '5', x2: '5', y2: '19' }),
  React.createElement('circle', { key: 'c1', cx: '6.5', cy: '6.5', r: '2.5' }),
  React.createElement('circle', { key: 'c2', cx: '17.5', cy: '17.5', r: '2.5' }),
]);

const CookieIcon = createIcon([
  React.createElement('circle', { key: 'c1', cx: '12', cy: '12', r: '10' }),
  React.createElement('circle', { key: 'c2', cx: '8', cy: '10', r: '1' }),
  React.createElement('circle', { key: 'c3', cx: '14', cy: '8', r: '1' }),
  React.createElement('circle', { key: 'c4', cx: '15', cy: '14', r: '1' }),
]);

const TeamIcon = UsersIcon;
const RocketIcon = createIcon([React.createElement('path', { key: 'p1', d: 'M4.5 19.5 9 15l0 0m6-6 4.5-4.5M14 10l-4 4m4-4 2-6 6-2-2 6-6 2Z' })]);
const BriefcaseIcon = createIcon([
  React.createElement('rect', { key: 'r1', x: '2', y: '7', width: '20', height: '14', rx: '2' }),
  React.createElement('path', { key: 'p1', d: 'M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2' }),
]);

const SadFaceIcon = createIcon([
  React.createElement('circle', { key: 'c1', cx: '12', cy: '12', r: '10' }),
  React.createElement('path', { key: 'p1', d: 'M8 15c1-1 2-1.5 4-1.5s3 .5 4 1.5' }),
  React.createElement('line', { key: 'l1', x1: '9', y1: '9', x2: '9.01', y2: '9' }),
  React.createElement('line', { key: 'l2', x1: '15', y1: '9', x2: '15.01', y2: '9' }),
]);

const TrendingUpIcon = createIcon([
  React.createElement('polyline', { key: 'p1', points: '22 7 13.5 15.5 8.5 10.5 2 17' }),
  React.createElement('polyline', { key: 'p2', points: '16 7 22 7 22 13' }),
]);

const VerifiedIcon = createIcon([
  React.createElement('circle', { key: 'c1', cx: '12', cy: '12', r: '10' }),
  React.createElement('path', { key: 'p1', d: 'm9 12 2 2 4-4' }),
]);

function LoadingSpinner({ className = '', size = 20 }) {
  return React.createElement(
    'div',
    { className: `inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`.trim(), style: { width: size, height: size } }
  );
}

function EmptyState({ title = 'Aucun résultat', description = '', action = null, icon = null }) {
  return React.createElement(
    'div',
    { className: 'text-center py-10 px-4' },
    icon ? React.createElement('div', { className: 'mb-3 flex justify-center' }, icon) : null,
    React.createElement('h3', { className: 'text-base font-semibold text-gray-900' }, title),
    description ? React.createElement('p', { className: 'mt-1 text-sm text-gray-500' }, description) : null,
    action ? React.createElement('div', { className: 'mt-4' }, action) : null
  );
}

function FollowButton({ userId, initialCount = 0, size = 'md' }) {
  const classes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-base' };
  return React.createElement(
    'button',
    {
      type: 'button',
      className: `${classes[size] || classes.md} bg-[#5B7CFF] text-white rounded-xl font-semibold hover:bg-[#4B6CEF] transition-all`,
      'data-user-id': userId,
    },
    `Suivre (${initialCount})`
  );
}

function LikeButton({ eventId, initialLiked = false, initialCount = 0, onChange }) {
  const [liked, setLiked] = React.useState(initialLiked);
  const [count, setCount] = React.useState(initialCount);
  const toggle = () => {
    const next = !liked;
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));
    if (typeof onChange === 'function') onChange(next);
  };
  return React.createElement(
    'button',
    { type: 'button', onClick: toggle, className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${liked ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700'}`, 'data-event-id': eventId },
    React.createElement(HeartIcon, { size: 14 }),
    `${count}`
  );
}

function PromoCodeInput({ onApply, placeholder = 'Code promo', className = '', disabled = false }) {
  const [code, setCode] = React.useState('');
  return React.createElement(
    'div',
    { className: `flex items-center gap-2 ${className}`.trim() },
    React.createElement('input', {
      type: 'text',
      value: code,
      disabled,
      onChange: (e) => setCode(e.target.value),
      placeholder,
      className: 'flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm',
    }),
    React.createElement(
      'button',
      {
        type: 'button',
        disabled: disabled || !code.trim(),
        onClick: () => onApply && onApply(code.trim()),
        className: 'px-3 py-2 bg-[#5B7CFF] text-white rounded-lg text-sm disabled:opacity-50',
      },
      'Appliquer'
    )
  );
}

function ReviewForm({ onSubmit, placeholder = 'Écrire un avis...' }) {
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState('');
  return React.createElement(
    'form',
    {
      onSubmit: (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit({ rating, comment });
      },
      className: 'space-y-3',
    },
    React.createElement('div', { className: 'flex gap-1' },
      [1,2,3,4,5].map((n) =>
        React.createElement(
          'button',
          { key: n, type: 'button', onClick: () => setRating(n), className: `${n <= rating ? 'text-yellow-500' : 'text-gray-300'}` },
          React.createElement(StarIcon, { size: 16 })
        )
      )
    ),
    React.createElement('textarea', {
      value: comment,
      onChange: (e) => setComment(e.target.value),
      placeholder,
      className: 'w-full min-h-[90px] p-3 border border-gray-300 rounded-lg text-sm',
    }),
    React.createElement('button', { type: 'submit', className: 'px-4 py-2 bg-[#5B7CFF] text-white rounded-lg text-sm' }, 'Envoyer')
  );
}

module.exports = {
  SearchIcon,
  UserIcon,
  UsersIcon,
  MenuIcon,
  CloseIcon,
  TicketIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  BellIcon,
  CalendarIcon,
  ClockIcon,
  LocationIcon,
  HeartIcon,
  SettingsIcon,
  MusicIcon,
  SportsIcon,
  TheaterIcon,
  FestivalIcon,
  ConferenceIcon,
  ArtIcon,
  FoodIcon,
  FamilyIcon,
  PlusIcon,
  ChartIcon,
  BarChartIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  RefreshIcon,
  ShareIcon,
  CopyIcon,
  EditIcon,
  TrashIcon,
  GlobeIcon,
  MoonIcon,
  LockIcon,
  ShieldIcon,
  ShieldCheckIcon,
  MailIcon,
  MailOpenIcon,
  PhoneIcon,
  FileIcon,
  CameraIcon,
  EyeIcon,
  DollarIcon,
  CreditCardIcon,
  OrderIcon,
  TargetIcon,
  TrophyIcon,
  PlayIcon,
  FilterIcon,
  PercentIcon,
  CookieIcon,
  TeamIcon,
  RocketIcon,
  BriefcaseIcon,
  SadFaceIcon,
  TrendingUpIcon,
  VerifiedIcon,
  LoadingSpinner,
  EmptyState,
  FollowButton,
  LikeButton,
  PromoCodeInput,
  ReviewForm,
};
