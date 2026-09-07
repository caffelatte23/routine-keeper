CREATE TABLE `completion` (
	`id` text PRIMARY KEY NOT NULL,
	`step_id` text NOT NULL,
	`date` text NOT NULL,
	`completed_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `completion_step_date` ON `completion` (`step_id`,`date`);--> statement-breakpoint
CREATE TABLE `meta` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `routine` (
	`id` text PRIMARY KEY NOT NULL,
	`group` text NOT NULL,
	`icon` text NOT NULL,
	`window_label` text NOT NULL,
	`start_time` text NOT NULL,
	`duration_label` text NOT NULL,
	`active_days` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `routine_step` (
	`id` text PRIMARY KEY NOT NULL,
	`routine_id` text NOT NULL,
	`name` text NOT NULL,
	`detail` text DEFAULT '' NOT NULL,
	`mins_label` text DEFAULT '' NOT NULL,
	`time_label` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`notify` integer DEFAULT 0 NOT NULL,
	`notify_at` text,
	`updated_at` integer NOT NULL,
	`deleted` integer DEFAULT 0 NOT NULL
);
