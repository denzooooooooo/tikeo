import * as React from 'react';

export type IconProps = {
  className?: string;
  size?: number;
};

export type FollowButtonProps = {
  userId: string;
  initialCount?: number;
  size?: 'sm' | 'md' | 'lg';
};

export type LikeButtonProps = {
  eventId: string;
  initialLiked?: boolean;
  initialCount?: number;
  onChange?: (liked: boolean) => void;
};

export type PromoCodeInputProps = {
  onApply?: (code: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export type ReviewFormProps = {
  onSubmit?: (payload: { rating: number; comment: string }) => void;
  placeholder?: string;
};

export type LoadingSpinnerProps = {
  className?: string;
  size?: number;
};

export type EmptyStateProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
};

export declare const SearchIcon: React.FC<IconProps>;
export declare const UserIcon: React.FC<IconProps>;
export declare const UsersIcon: React.FC<IconProps>;
export declare const MenuIcon: React.FC<IconProps>;
export declare const CloseIcon: React.FC<IconProps>;
export declare const TicketIcon: React.FC<IconProps>;
export declare const ArrowRightIcon: React.FC<IconProps>;
export declare const ArrowLeftIcon: React.FC<IconProps>;
export declare const BellIcon: React.FC<IconProps>;
export declare const CalendarIcon: React.FC<IconProps>;
export declare const ClockIcon: React.FC<IconProps>;
export declare const LocationIcon: React.FC<IconProps>;
export declare const HeartIcon: React.FC<IconProps>;
export declare const SettingsIcon: React.FC<IconProps>;
export declare const MusicIcon: React.FC<IconProps>;
export declare const SportsIcon: React.FC<IconProps>;
export declare const TheaterIcon: React.FC<IconProps>;
export declare const FestivalIcon: React.FC<IconProps>;
export declare const ConferenceIcon: React.FC<IconProps>;
export declare const ArtIcon: React.FC<IconProps>;
export declare const FoodIcon: React.FC<IconProps>;
export declare const FamilyIcon: React.FC<IconProps>;
export declare const PlusIcon: React.FC<IconProps>;
export declare const ChartIcon: React.FC<IconProps>;
export declare const BarChartIcon: React.FC<IconProps>;
export declare const StarIcon: React.FC<IconProps>;
export declare const CheckCircleIcon: React.FC<IconProps>;
export declare const XCircleIcon: React.FC<IconProps>;
export declare const RefreshIcon: React.FC<IconProps>;
export declare const ShareIcon: React.FC<IconProps>;
export declare const CopyIcon: React.FC<IconProps>;
export declare const EditIcon: React.FC<IconProps>;
export declare const TrashIcon: React.FC<IconProps>;
export declare const GlobeIcon: React.FC<IconProps>;
export declare const MoonIcon: React.FC<IconProps>;
export declare const LockIcon: React.FC<IconProps>;
export declare const ShieldIcon: React.FC<IconProps>;
export declare const ShieldCheckIcon: React.FC<IconProps>;
export declare const MailIcon: React.FC<IconProps>;
export declare const MailOpenIcon: React.FC<IconProps>;
export declare const PhoneIcon: React.FC<IconProps>;
export declare const FileIcon: React.FC<IconProps>;
export declare const CameraIcon: React.FC<IconProps>;
export declare const EyeIcon: React.FC<IconProps>;
export declare const DollarIcon: React.FC<IconProps>;
export declare const CreditCardIcon: React.FC<IconProps>;
export declare const OrderIcon: React.FC<IconProps>;
export declare const TargetIcon: React.FC<IconProps>;
export declare const TrophyIcon: React.FC<IconProps>;
export declare const PlayIcon: React.FC<IconProps>;
export declare const FilterIcon: React.FC<IconProps>;
export declare const PercentIcon: React.FC<IconProps>;
export declare const CookieIcon: React.FC<IconProps>;
export declare const TeamIcon: React.FC<IconProps>;
export declare const RocketIcon: React.FC<IconProps>;
export declare const BriefcaseIcon: React.FC<IconProps>;
export declare const SadFaceIcon: React.FC<IconProps>;
export declare const TrendingUpIcon: React.FC<IconProps>;
export declare const VerifiedIcon: React.FC<IconProps>;

export declare const LoadingSpinner: React.FC<LoadingSpinnerProps>;
export declare const EmptyState: React.FC<EmptyStateProps>;
export declare const FollowButton: React.FC<FollowButtonProps>;
export declare const LikeButton: React.FC<LikeButtonProps>;
export declare const PromoCodeInput: React.FC<PromoCodeInputProps>;
export declare const ReviewForm: React.FC<ReviewFormProps>;
